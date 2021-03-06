'use strict'

var Promise = require('bluebird')
var Iron = require('iron')
var Base64 = require('base64-url')

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    message.action = global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_ABIBAO_CAMPAIGN_PUBLISH_AUTO
    var sealed = ''
    Iron.seal(message, global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'), Iron.defaults, function (error, result) {
      if (error) { throw new Error(error) }
      sealed = Base64.encode(result)
      global.ABIBAO.debuggers.domain('sealed=%s', sealed)
      // send email
      var sendgrid = require('sendgrid')(global.ABIBAO.config('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))
      var request = sendgrid.emptyRequest()
      request.method = 'POST'
      request.path = '/v3/mail/send'
      request.body = {
        'personalizations': [
          {
            'to': [
              { 'email': message.email }
            ],
            'subject': "Regardez comme il est facile d'aider une association.",
            'substitutions': {
              '%urn_survey%': global.ABIBAO.config('ABIBAO_API_GATEWAY_URI') + '/redirect/campaign/assign/' + sealed
            }
          }
        ],
        'from': { 'email': 'bonjour@abibao.com', 'name': 'Abibao' },
        'content': [
          {
            'type': 'text/html',
            'value': ' '
          }
        ],
        'template_id': global.ABIBAO.config('ABIBAO_API_GATEWAY_SENDGRID_TEMPLATE_ABIBAO_AFFECT_CAMPAIGNS_AUTO')
      }
      sendgrid.API(request, function (error, response) {
        if (error) {
          reject(error)
        } else {
          if (response.statusCode === 202) {
            resolve()
          } else {
            reject(response)
          }
        }
      })
    })
  })
}
