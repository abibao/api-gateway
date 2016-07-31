'use strict'

const Promise = require('bluebird')
const nconf = global.ABIBAO.nconf

module.exports = function (individual) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, {
      'channel': '#cast-members-only',
      'username': 'IndividualRegisterCommand',
      'text': '[' + new Date() + '] - [' + individual.email + '] has just registered into abibao',
      'webhook': nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
    })
    resolve({command: 'webhookSlackIndividualCreateCommand', status: 'ok'})
  })
}
