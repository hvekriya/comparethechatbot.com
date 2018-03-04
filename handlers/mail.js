const nodemailer = require('nodemailer')
// const pug = require('pug')
// const juice = require('juice')
// const htmlToText = require('html-to-text')
const promisify = require('es6-promisify')

// let transport = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS
//   }
// })

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'ee314f54c96c55',
    pass: '4ff6a59af23163'
  }
})

exports.send = async (options) => {
  const mailOptions = {
    from: `Haresh Vekriya <noreply@haresh.com>`,
    to: options.user.email,
    html: 'This will be filled in later',
    text: 'This will also be filled in later'
  }
  const sendMail = promisify(transport.sendMail, transport)
  return sendMail(mailOptions)
}
