import $ from 'jquery'
import axios from 'axios'
const moment = require('moment')
var striptags = require('striptags')

var $content = $('#jsonContent')

$(function () {
  axios
      .get('https://api.rss2json.com/v1/api.json?rss_url=https://chatbotsmagazine.com/feed')
      .then(res => {
        var output = ''
        $.each(res.data.items, function (k, item) {
          var visibleSm
          if (k < 6) {
            visibleSm = ''
          } else {
            visibleSm = ' visible-sm'
          }
          output += '<div class="col-sm-6 col-md-4' + visibleSm + '">'
          output += '<div class="blog-post"><header>'
          output += '<h4 class="date">' + moment(item.pubDate).format('MMM <br> YY') + '</h4>'
          var tagIndex = item.description.indexOf('<img') // Find where the img tag starts
          var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex // Find where the src attribute starts
          var srcStart = srcIndex + 5 // Find where the actual image URL starts; 5 for the length of 'src="'
          var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart // Find where the URL ends
          var src = item.description.substring(srcStart, srcEnd) // Extract just the URL
          output += '<div class="blog-element animated fadeIn"><img class="img-responsive news-img" src="' + src + '" width="360px" height="240px"></div></header>'

            // trim the title so its not too big

          var title = item.title
          var titleChars = 80
            // add the ... if the title is longer than 80 chars
          if (title.length > titleChars) {
            var trimmedTitle = title.substr(0, titleChars)
            trimmedTitle = trimmedTitle.substr(0, Math.min(trimmedTitle.length, trimmedTitle.lastIndexOf(' ')))
            output += '<div class="blog-content"><h4><a class="article-link" href="' + item.link + '">' + trimmedTitle + '...' + '</a></h4>'
          } else {
            output += '<div class="blog-content"><h4><a class="article-link" href="' + item.link + '">' + item.title + '</a></h4>'
          }

          output += '<div class="post-meta"><span>By ' + item.author + '</span></div>'
          var yourString = striptags(item.description) // stritags module will allow us to strip any html tag that come in the response.
          var maxLength = 120 // maximum number of characters to extract
            // trim the string to the maximum length
          var trimmedString = yourString.substr(0, maxLength)
            // re-trim if we are in the middle of a word
          trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')))
          output += '<p>' + trimmedString + '...</p>'
          output += '</div></div></div>'
          return k < 6
        })
        $content.html(output)
      })
      .catch(err => {
        console.error(err)
      })
})
