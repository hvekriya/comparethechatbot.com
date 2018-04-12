import $ from 'jquery'

var localStorage = window.localStorage
$(function () {
  if (localStorage.getItem('feedback-message') === 'true') {
    $('.feedback-message').hide()
  } else {
    $('.feedback-message').show()
  }
})

$('.close').click(function () {
  localStorage.setItem('feedback-message', 'true')
})
