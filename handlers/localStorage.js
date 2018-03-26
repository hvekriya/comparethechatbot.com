// helper to save and get stuff from local storage

exports.saveToLocalStorage = (key, value) => {
  var localStorage = require('localStorage')
  localStorage.setItem(key, JSON.stringify(value))
}

exports.getFromLocalStorage = (key) => {
  var localStorage = require('localStorage')
  return JSON.parse(localStorage.getItem(key))
}
