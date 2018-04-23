// helper to save and get stuff from local storage
var localStorage = require('localStorage')

exports.saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

exports.getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

exports.removeItem = (key) => {
  localStorage.removeItem(key)
}

exports.clearStorage = () => {
  localStorage.clear()
}
