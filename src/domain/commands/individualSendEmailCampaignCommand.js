'use strict'

var Promise = require('bluebird')

// var Iron = require('iron')
// var Base64 = require('base64-url')
// var nodemailer = require('nodemailer')

module.exports = function (data) {
  return new Promise(function (resolve, reject) {
    resolve()
  })
}

/*
module.exports = function (data) {
  return new Promise(function (resolve, reject) {
    try {
      var unsealed = data
      unsealed.action = global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH
      Iron.seal(unsealed, global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), Iron.defaults, function (err, sealed) {
        if (err) { return reject(err) }
        sealed = Base64.encode(sealed)
        var mailOptions = {
          from: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_NAME') + ' <' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_EMAIL') + '>',
          to: data.email,
          subject: '[abibao.com] - un sondage est disponible',
          text: global.ABIBAO.nconf.get('ABIBAO_WEB_SURVEYS_URI') + '/assign/' + sealed,
          html: '<a href="' + global.ABIBAO.nconf.get('ABIBAO_WEB_SURVEYS_URI') + '/assign/' + sealed + '">Cliquez ici pour commencer le sondage.</a>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) { return reject(error) }
          if (!info) { return reject(new Error('no informations found')) }
          resolve()
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}
*/
