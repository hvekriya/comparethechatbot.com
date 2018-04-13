/* eslint-env mocha */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const chai = require('chai')
const expect = chai.expect

require('dotenv').config({ path: 'local-variables.env' })

const Chatbot = require('../models/test-chabot-model')

describe('Add chatbot tests', function () {
  // Before starting the test, create a sandboxed database connection
  // Once a connection is established invoke done()
  before(function (done) {
    // Connect to our Database and handle an bad connections
    mongoose.connect(process.env.DATABASE)
    mongoose.Promise = global.Promise // Tell Mongoose to use ES6 promises
    mongoose.connection.on('open', () => {
      console.log('Connected to test database!')
      done()
    })
    mongoose.connection.on('error', (err) => {
      console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
    })
  })
  describe('Test add a chatbot', function () {
    // Save object with 'name' value of 'Mike"
    it('New chatbot saved to test database', function (done) {
      var testAdd = Chatbot({
        name: 'testbot',
        api: 'test.com/api',
        company: 'tesbot',
        description: 'tesbot',
        tags: [ 'AI', 'Personal', 'Robotics', 'Travel' ],
        author: '5a78a3e330448b0f2ccc9336'
      })

      testAdd.save(done)
    })
    it('Required name field in chatbot test database', function (done) {
      // Attempt to save with wrong info. An error should trigger
      var wrongSave = Chatbot({
        name: '',
        api: 'test.com/api',
        company: 'tesbot',
        description: 'tesbot',
        tags: [ 'AI', 'Personal', 'Robotics', 'Travel' ],
        author: '5a78a3e330448b0f2ccc9336'
      })
      wrongSave.save(err => {
        if (err) { return done() }
        throw new Error('Should generate error!')
      })
    })
    it('Required company field in chatbot test database', function (done) {
      // Attempt to save with wrong info. An error should trigger
      var wrongSave = Chatbot({
        name: 'testbot',
        api: 'test.com/api',
        company: '',
        description: 'tesbot',
        tags: [ 'AI', 'Personal', 'Robotics', 'Travel' ],
        author: '5a78a3e330448b0f2ccc9336'
      })
      wrongSave.save(err => {
        if (err) { return done() }
        throw new Error('Should generate error!')
      })
    })
    it('Should retrieve data from test database', function (done) {
      // Look up the 'Mike' object previously saved.
      Chatbot.find({name: 'testbot'}, (err, name) => {
        if (err) { throw err }
        if (name.length === 0) { throw new Error('No data!') }
        done()
      })
    })
  })
  // After all tests are finished drop database and close connection
  after(function (done) {
    Chatbot.collection.drop()
    mongoose.connection.db.dropCollection('chatbot-test', function () {
      mongoose.connection.close(done)
    })
  })
})
