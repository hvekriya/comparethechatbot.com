const nodemailer = require('nodemailer')
// const pug = require('pug')
// const juice = require('juice')
// const htmlToText = require('html-to-text')
const promisify = require('es6-promisify')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

exports.send = async (options) => {
  const mailOptions = {
    from: `Haresh Vekriya <noreply@haresh.com>`,
    to: options.user.email,
    html: '<a href="' + options.resetURL + '">Reset URL</a>',
    text: 'This will also be filled in later'
  }
  const sendMail = promisify(transporter.sendMail, transporter)
  return sendMail(mailOptions)
}
