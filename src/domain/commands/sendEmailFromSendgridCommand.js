'use strict'

const Promise = require('bluebird')
const sendgrid = require('sendgrid').SendGrid(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))
const request = sendgrid.emptyRequest()

module.exports = function (body) {
  return new Promise(function (resolve, reject) {
    request.method = 'POST'
    request.path = '/v3/mail/send'
    request.body = body
    sendgrid.API(request, function (response) {
      if (response.statusCode === 202) {
        resolve({command: 'sendEmailFromSendgridCommand', status: 'ok'})
      } else {
        reject({command: 'sendEmailFromSendgridCommand', status: 'failed', error: {}})
      }
    })
  })
}
