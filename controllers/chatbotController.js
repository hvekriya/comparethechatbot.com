const mongoose = require("mongoose")
const Chatbot = mongoose.model("Chatbot")
const User = mongoose.model("User")
const multer = require("multer")
const jimp = require("jimp")
const uuid = require("uuid")
const localStorage = require("../handlers/localStorage")
const cloudinary = require("cloudinary")
const Datauri = require("datauri")
const path = require("path")
const fs = require("fs")

require("dotenv").config({ path: "local-variables.env" })

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/")
    if (isPhoto) {
      next(null, true)
    } else {
      next({ message: "That filetype isn't allowed!" }, false)
    }
  }
}

exports.homePage = (req, res) => {
  res.render("index")
}

exports.addChatbot = (req, res) => {
  res.render("editChatbot", { title: "Add Chatbot" })
}

exports.upload = multer(multerOptions).single("photo")

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next() // skip to the next middleware
    return
  }
  const extension = req.file.mimetype.split("/")[1]
  req.body.photo = `${uuid.v4()}.${extension}`
  // now we resize
  const photo = await jimp.read(req.file.buffer)
  await photo.resize(800, jimp.AUTO)
  await photo.write(`./public/uploads/${req.body.photo}`)
  // once we have written the photo to our filesystem, keep going!
  next()
}

// function to upload images to cloudinary
exports.uploadPhoto = async (req, res, next) => {
  var dUri = new Datauri()
  //cloudinary requires the image to be stored in a temporary folder. We will delete it once uploaded
  if (req.body.photo) {
    dUri.format(
      path.extname(`./public/uploads/${req.body.photo}`).toString(),
      req.file.buffer
    )

    await cloudinary.v2.uploader.upload(dUri.content, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        // lets delete the image now as it is uploaded succesfully.
        fs.unlink(`./public/uploads/${req.body.photo}`, err => {
          if (err) throw err
          console.log(`${req.body.photo} was deleted`)
        })
        // lets store the new image name into the variable and it will be stored in the database
        req.body.photo = result.secure_url
        next()
      }
    })
  } else {
    next()
  }
}

exports.createChatbot = async (req, res) => {
  req.body.author = req.user._id
  const chatbot = await new Chatbot(req.body).save()
  console.log(req.body)
  req.flash(
    "success",
    `Successfully Created ${chatbot.name}. Care to leave a review?`
  )
  res.redirect(`/chatbot/${chatbot.slug}`)
}

exports.getChatbots = async (req, res) => {
  const page = req.params.page || 1
  const limit = 6
  const skip = page * limit - limit
  // 1. Query the database for a list of all chatbots
  const chatbotsPromise = Chatbot.find()
    .skip(skip)
    .limit(limit)
    .sort({ created: "desc" })
  const countPromise = Chatbot.count()
  const [chatbots, count] = await Promise.all([chatbotsPromise, countPromise])
  const pages = Math.ceil(count / limit)
  if (!chatbots.length && skip) {
    req.flash(
      "info",
      `Hey! That page doesn't exit so you have been redirected to the last page.`
    )
    res.redirect(`/chatbots/page/${pages}`)
    return
  }
  res.render("chatbots", { title: "Chatbots", chatbots, page, pages, count })
}

const confirmOwner = (chatbot, user) => {
  if (!chatbot.author.equals(user._id)) {
    throw Error("You must own a chatbot in order to edit it!")
  }
}

exports.editChatbot = async (req, res) => {
  // 1. Find the chatbot given the ID
  const chatbot = await Chatbot.findOne({ _id: req.params.id })
  // 2. confirm they are the owner of the chatbot
  confirmOwner(chatbot, req.user)
  // 3. Render out the edit form so the user can update their chatbot
  res.render("editChatbot", { title: `Edit ${chatbot.name}`, chatbot })
}

exports.updateChatbot = async (req, res) => {
  // find and update the chatbot
  const chatbot = await Chatbot.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true, // return the new chatbot instead of the old one
      runValidators: true
    }
  ).exec()
  req.flash(
    "success",
    `Successfully updated <strong>${chatbot.name}</strong>. <a href="/chatbot/${
      chatbot.slug
    }">View Chatbot →</a>`
  )
  res.redirect(`/chatbots/${chatbot._id}/edit`)
  // Redriect them the chatbot and tell them it worked
}

exports.getChatbotBySlug = async (req, res, next) => {
  const chatbot = await Chatbot.findOne({ slug: req.params.slug }).populate(
    "author reviews"
  )
  if (!chatbot) return next()
  res.render("chatbot", { chatbot, title: chatbot.name })
}

exports.getChatbotsByTag = async (req, res) => {
  const tag = req.params.tag
  const tagQuery = tag || { $exists: true }

  const tagsPromise = Chatbot.getTagsList()
  const chatbotsPromise = Chatbot.find({ tags: tagQuery })
  const [tags, chatbots] = await Promise.all([tagsPromise, chatbotsPromise])

  res.render("tag", { tags, title: "Tags", tag, chatbots })
}

exports.searchChatbots = async (req, res) => {
  const chatbots = await Chatbot
    // first find chatbots that match
    .find(
      {
        $text: {
          $search: req.query.q
        }
      },
      {
        score: { $meta: "textScore" }
      }
    )
    // the sort them
    .sort({
      score: { $meta: "textScore" }
    })
    // limit to only 5 results
    .limit(5)
  res.json(chatbots)
}

exports.heartChatbot = async (req, res) => {
  const hearts = req.user.hearts.map(obj => obj.toString())

  const operator = hearts.includes(req.params.id) ? "$pull" : "$addToSet"
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { [operator]: { hearts: req.params.id } },
    { new: true }
  )
  res.json(user)
}

exports.getHearts = async (req, res) => {
  const chatbots = await Chatbot.find({
    _id: { $in: req.user.hearts }
  })
  res.render("chatbots", { title: "Hearted Chatbots", chatbots })
}

exports.getTopChatbots = async (req, res) => {
  const chatbots = await Chatbot.getTopChatbots()
  res.render("topChatbots", { chatbots, title: "Top Chatbots" })
}

exports.addToComparision = async (req, res) => {
  const id = req.params.id
  const chatbot = await Chatbot.findOne({ _id: id })

  const chatbotOne = localStorage.getFromLocalStorage("chatbotOne")
  const chatbotTwo = localStorage.getFromLocalStorage("chatbotTwo")
  
  var counter = +1

  if (localStorage.getFromLocalStorage("counter")) {
    counter = counter + parseInt(localStorage.getFromLocalStorage("counter"))
  }

  if (counter > 2) {
    localStorage.clearStorage()
    counter = 0
    console.log("The counter is " + counter)
    console.log("The chatbot one is " + chatbotOne)
    console.log("The chatbot two is " + chatbotTwo)
  }

  localStorage.saveToLocalStorage("counter", counter)

  if (chatbotOne === null && chatbotTwo === null) {
    localStorage.saveToLocalStorage("chatbotOne", chatbot.name)
  } else if (chatbotOne !== null && chatbotTwo === null) {
    localStorage.saveToLocalStorage("chatbotTwo", chatbot.name)
  } else if (chatbotOne === null && chatbotTwo !== null) {
    localStorage.saveToLocalStorage("chatbotOne", chatbot.name)
  }

  if (counter === 1) {
    req.flash("success", `Successfully added <strong>${chatbot.name}</strong>. Please add another one`)
  } else {
    req.flash("success", `Successfully added <strong>${chatbot.name}</strong>. <a href="compare">Click here to compare</a>`)
  }
  res.redirect(`/`)
}
