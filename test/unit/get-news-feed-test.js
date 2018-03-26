/* eslint-env mocha */

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

// describe('Get news feed', function () {
//   it('fails, as expected', function (done) { // <= Pass in done callback
//     chai.request('https://api.rss2json.com/v1/api.json?rss_url=https://chatbotsmagazine.com/fee')
//   .get('/')
//   .end(function (err, res) {
//     expect(res).to.have.status(123)
//     done()                               // <= Call done to signal callback end
//   })
//   })

//   it('succeeds silently!', function () {   // <= No done callback
//     chai.request('https://api.rss2json.com/v1/api.json?rss_url=https://chatbotsmagazine.com/feed')
//   .get('/')
//   .end(function (err, res) {
//     console.log(res.body)
//     expect(res).to.have.status(123)    // <= Test completes before this runs
//   })
//   })
// })
