const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const chatbotSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a chatbot name!'
  },
  api: {
    type: String,
    trim: true
  },
  framework: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    required: 'Please enter a company name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
}, {
  toJSON: { virtuals: true },
  toOjbect: { virtuals: true }
})

// Define our indexes
chatbotSchema.index({
  name: 'text',
  description: 'text',
  company: 'text'
})

chatbotSchema.index({ location: '2dsphere' })

chatbotSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next() // skip it
    return // stop this function from running
  }
  this.slug = slug(this.name)
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const chatbotsWithSlug = await this.constructor.find({ slug: slugRegEx })
  if (chatbotsWithSlug.length) {
    this.slug = `${this.slug}-${chatbotsWithSlug.length + 1}`
  }
  next()
  // TODO make more resiliant so slugs are unique
})

chatbotSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
}

chatbotSchema.statics.getTopChatbots = function () {
  return this.aggregate([
    // look up chatbots and populate their reviews
    {$lookup: {
      from: 'reviews',
      localField: '_id',
      foreignField: 'chatbot',
      as: 'reviews'}
    },
    // filter for only items that 2 or more reviews
    {$match: {
      'reviews.1': {
        $exists: true
      }
    }},
    // add the average reviews field
    {$project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      'slug': '$$ROOT.slug',
      averageRating: {
        $avg: '$reviews.rating'
      }
    }},
    // sort it by our new field, highest reviews first
    {$sort: {
      averageRating: -1
    }},
    // limit to at most 10
    {$limit: 10}
  ])
}

// find reviews where the chatbots _id property === reviews chatbot property
chatbotSchema.virtual('reviews', {
  ref: 'Review', // what model to link?
  localField: '_id', // which field on the chatbot?
  foreignField: 'chatbot' // which field on the review?
})

function autopopulate (next) {
  this.populate('reviews')
  next()
}

chatbotSchema.pre('find', autopopulate)
chatbotSchema.pre('findOne', autopopulate)

module.exports = mongoose.model('Chatbot', chatbotSchema)
