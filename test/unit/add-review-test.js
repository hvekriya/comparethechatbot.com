/* eslint-env mocha */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const chai = require('chai')
const expect = chai.expect

require('dotenv').config({ path: 'local-variables.env' })

const Review = require('../models/test-review-model')
