'use strict'

var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')
var nodemailer = require('nodemailer')

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  pool: true,
  host: nconf.get('ABIBAO_API_GATEWAY_SERVER_MAILER_HOST'),
  port: nconf.get('ABIBAO_API_GATEWAY_SERVER_MAILER_PORT'),
  auth: {
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MAILER_USERNAME'),
    pass: nconf.get('ABIBAO_API_GATEWAY_SERVER_MAILER_PASSWORD')
  }
})

module.exports = function (payload) {
  return new Promise(function (resolve, reject) {
    try {
      var htmlstream = fs.createReadStream(path.resolve(__dirname, '../..', '_emails/template_register.html'))

      var mailOptions = {
        from: nconf.get('ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_NAME') + ' <' + nconf.get('ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_EMAIL') + '>',
        to: payload.email,
        subject: '[abibao.com] - Bienvenue sur Abibao',
        html: htmlstream,
        attachments: [{
          filename: 'icon_mail.png',
          path: path.resolve(__dirname, '../..', '_emails/images/icon_mail.png'),
          cid: 'icon_mail@abibao.com'
        }, {
          filename: 'logo_abibao_mail_01.gif',
          path: path.resolve(__dirname, '../..', '_emails/images/logo_abibao_mail_01.gif'),
          cid: 'logo_abibao_mail_01@abibao.com'
        }]
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) { return reject(error) }
        if (!info) { return reject(new Error('no informations found')) }
        resolve()
      })
    } catch (e) {
      reject(e)
    }
  })
}
