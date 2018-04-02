/* eslint-env mocha */

var webdriver = require('selenium-webdriver'),
  // { describe, it, after, before } = require('selenium-webdriver/testing'),
  By = webdriver.By,
  until = webdriver.until
var driver
var test = require('selenium-webdriver/testing')

test.describe('Comparethechatbot app scenarios', function () {
  this.timeout(50000)
  test.beforeEach(function () {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build()
    driver.get('http://library-app.firebaseapp.com')
  })
  test.afterEach(function () {
    driver.quit()
  })

  test.it('Changes Button opacity upon email being filled out', function () {
    var submitBtn = driver.findElement(By.css('.btn-lg'))
    driver.findElement(By.css('input').sendKeys('us@fakemail.com'))
    driver.wait(function () {
      return submitBtn.getCssValue('opacity').then(function (result) {
        return result === '1'
      })
    }, 5000)
  })
  test.it('Click the submit button', function () {
    var submitBtn = driver.findElement(By.css('.btn-lg'))
    driver.findElement(By.css('input').sendKeys('us@fakemail.com'))
    submitBtn.click()
    driver.wait(until.elementLocated(By.css('.aler-success')), 5000).getText().then(function (text) {
      console.log('Alert success text is:' + text)
    })
  })
  test.it('Check the nav bar items', function () {
    driver.findElement(By.css('nav')).getText().then(function (text) {
      console.log(text)
    })
  })
})
