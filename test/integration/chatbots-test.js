/* eslint-env mocha */

const {Builder, By, Key, until} = require('selenium-webdriver')

var driver

describe('Comparethechatbot app scenarios', function () {
  this.timeout(50000)

  beforeEach(function () {
    driver = new Builder().forBrowser('chrome').build()
    driver.get('http://library-app.firebaseapp.com')
  })
  afterEach(function () {
    driver.quit()
  })

  it('Changes Button opacity upon email being filled out', function () {
    var submitBtn = driver.findElement(By.css('.btn-lg'))
    driver.findElement(By.css('input').sendKeys('us@fakemail.com'))
    driver.wait(function () {
      return submitBtn.getCssValue('opacity').then(function (result) {
        return result === '1'
      })
    }, 5000)
  })
  it('Click the submit button', function () {
    var submitBtn = driver.findElement(By.css('.btn-lg'))
    driver.findElement(By.css('input').sendKeys('us@fakemail.com'))
    submitBtn.click()
    driver.wait(until.elementLocated(By.css('.aler-success')), 5000).getText().then(function (text) {
      console.log('Alert success text is:' + text)
    })
  })
  it('Check the nav bar items', function () {
    driver.findElement(By.css('nav')).getText().then(function (text) {
      console.log(text)
    })
  })
})
