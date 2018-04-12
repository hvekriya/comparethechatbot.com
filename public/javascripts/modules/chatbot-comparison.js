import $ from 'jquery'
import axios from 'axios'

$('.spinner-one').hide()
$('.spinner-two').hide()

$('.mytext').on('keydown', function (e) {
  if (e.which === 13) {
    e.preventDefault()
    send()
  }
})

$('#send').on('click', function () {
  send()
})

function send () {
  // multiple concurrent requests to two chatbots
  axios.all([chatbotOne(), chatbotTwo()])
    .then(axios.spread(function (botOneResponse, botTwoResonse) {
    }))
}

// instead of creating the main post requests we are going to handle them in the back. Post to end points require special keys and these should be kept safe so
// we can grab these and keep them in the back only. We will send request to back end which will send request to end point and return it

function chatbotOne () {
  var text = $('.mytext').val()
  // Send a get request to back end
  insertChatOne('me', text)
  axios({
    method: 'get',
    url: `http://localhost:7777/api/chatbotOne?query=${text}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
    // lets hide the loading animation
      $('.spinner-one').hide()
      var data = res.data.result.speech
      // empty the input ready for next input
      $('.mytext').val('')
      insertChatOne('', data)
    })
    .catch(function (error) {
      console.log(error)
    })
}

function chatbotTwo () {
  var text = $('.mytext').val()
  // Send a get request to back end
  insertChatTwo('me', text)
  return axios({
    method: 'get',
    url: `http://localhost:7777/api/chatbotTwo?query=${text}`
  })
    .then(res => {
    // lets hide the loading animation
      $('.spinner-two').hide()
      var data = res.data
      insertChatTwo('', data)
    })
    .catch(function (error) {
      console.log(error)
    })
}

// show the loading spinners on text input
$('input.mytext').on('input', function (e) {
  $('.spinner-one').show()
  $('.spinner-two').show()
})

function formatAMPM (date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

var me = {}
me.avatar = 'images/icons/you.png'

function insertChatOne (who, text, time) {
  var you = {}
  you.avatar = 'images/icons/chatbot-1.png'

  if (time === undefined) {
    time = 0
  }
  var control = ''
  var date = formatAMPM(new Date())

  if (who === 'me') {
    control = '<li style="width:70%">' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + me.avatar + '" /></div>' +
                            '<div class="text text-l">' +
                                '<p>' + text + '</p>' +
                                '<p><small>' + date + '</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>'
  } else {
    control = '<li style="width:70%;">' +
                        '<div class="msj-rta macro chat1" style="margin-left: 130px;">' +
                            '<div class="text text-r">' +
                                '<p>' + text + '</p>' +
                                '<p><small>' + date + '</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + you.avatar + '" /></div>' +
                  '</li>'
  }
  setTimeout(
    function () {
      $('ul.chat-one').append(control).scrollTop($('ul.chat-one').prop('scrollHeight'))
    }, time)
}

function insertChatTwo (who, text, time) {
  var you = {}
  you.avatar = 'images/icons/chatbot-2.png'

  if (time === undefined) {
    time = 0
  }
  var control = ''
  var date = formatAMPM(new Date())

  if (who === 'me') {
    control = '<li style="width:70%">' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + me.avatar + '" /></div>' +
                            '<div class="text text-l">' +
                                '<p>' + text + '</p>' +
                                '<p><small>' + date + '</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>'
  } else {
    control = '<li style="width:70%;">' +
                        '<div class="msj-rta macro chat2" style="margin-left: 130px;">' +
                            '<div class="text text-r">' +
                                '<p>' + text + '</p>' +
                                '<p><small>' + date + '</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + you.avatar + '" /></div>' +
                  '</li>'
  }
  setTimeout(
    function () {
      $('ul.chat-two').append(control).scrollTop($('ul.chat-two').prop('scrollHeight'))
    }, time)
}
