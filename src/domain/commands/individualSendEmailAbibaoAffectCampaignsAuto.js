'use strict'

var Promise = require('bluebird')

var nconf = global.ABIBAO.nconf
var Iron = require('iron')
var Base64 = require('base64-url')

var sendgrid = require('sendgrid')(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    try {
      message.action = global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_ABIBAO_CAMPAIGN_PUBLISH_AUTO
      var sealed = ''
      Iron.seal(message, nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), Iron.defaults, function (error, result) {
        if (error) { throw new Error(error) }
        sealed = Base64.encode(result)
        global.ABIBAO.debuggers.domain('sealed=%s', sealed)
        // send email
        var email = new sendgrid.Email({
          to: [message.email],
          from: 'team@abibao.com',
          fromname: 'Team Abibao',
          subject: 'Bienvenue sur Abibao',
          text: ' ',
          html: ' '
        })
        email.addCategory('individual_welcome')
        email.addSubstitution('%urn_survey%', global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_URI') + '/redirect/campaign/affect/' + sealed)
        email.addFilter('templates', 'enable', 1)
        email.addFilter('templates', 'template_id', global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_TEMPLATE_ABIBAO_AFFECT_CAMPAIGNS_AUTO'))
        sendgrid.send(email, function (error, json) {
          if (error) { return reject(error) }
          resolve(json)
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}
