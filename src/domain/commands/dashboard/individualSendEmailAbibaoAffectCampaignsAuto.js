'use strict'

var Promise = require('bluebird')

var nconf = global.ABIBAO.nconf
var Iron = require('iron')
var Base64 = require('base64-url')

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    message.action = global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_ABIBAO_CAMPAIGN_PUBLISH_AUTO
    var sealed = ''
    Iron.seal(message, nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), Iron.defaults, function (error, result) {
      if (error) { throw new Error(error) }
      sealed = Base64.encode(result)
      global.ABIBAO.debuggers.domain('sealed=%s', sealed)
      // send email
      var sendgrid = require('sendgrid')(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))
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
              '%urn_survey%': global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_URI') + '/redirect/campaign/affect/' + sealed
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
        'template_id': global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_TEMPLATE_ABIBAO_AFFECT_CAMPAIGNS_AUTO')
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
