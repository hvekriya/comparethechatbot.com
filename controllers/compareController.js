/*
This is a wrapper that lets front end code send API end point post request
without revealing any screts keys to front end
*/

var request = require('request')
const localStorage = require('../handlers/localStorage')

var Cleverbot = require('cleverbot-node')
var cleverbot = new Cleverbot()
cleverbot.configure({botapi: 'CC7x6yx7mGhTcqTC3N6SEM7c3YQ'})

// create two request to API's
// lets get the special key from the .env for now
// In future we can keep hash and store them in database and then dycrypt it when using

var chatbotOneToken = 'a2dadcb2a1674cf99b33a044e7ab6e2c'
var chatbotOneUrl = 'https://api.api.ai/v1/query'

// var chatbotTwoToken = 'CC7x6yx7mGhTcqTC3N6SEM7c3YQ'
// var chatbotTwoUrl = 'https://www.cleverbot.com/getreply'

exports.getChatBots = (req, res) => {
  const chatbotOne = localStorage.getFromLocalStorage('chatbotOne')
  const chatbotTwo = localStorage.getFromLocalStorage('chatbotTwo')
  console.log("The chatbot one is " + chatbotOne)
  console.log("The chatbot two is " + chatbotTwo)

  if (chatbotOne !== null || chatbotTwo !== null) {
    return res.render('compare', {title: 'Compare chatbots', chatbotOne: chatbotOne, chatbotTwo: chatbotTwo})
  } else {
    req.flash('info', `Hey! You need to add one or more chatbots to comparision.`)
    res.redirect(`/`)
  }
}

exports.chatbotOne = async (req, res) => {
  var options = { method: 'POST',
    url: chatbotOneUrl,
    headers:
    { 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + chatbotOneToken },
    body: { query: req.query.query, lang: 'en', sessionId: 'runbarry' },
    json: true }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    res.json(body)
  })
}

exports.chatbotTwo = async (req, res) => {
  var query = req.query.query
  cleverbot.write(query, function (response) {
    res.json(response.output)
  })
}
