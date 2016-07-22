'use strict'

const errors = require('feathers-errors')
const Promise = require('bluebird')

const Hoek = require('hoek')
const nconf = global.ABIBAO.nconf

module.exports = function (payload) {
  const self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    // email to lowercase
    payload.email = payload.email.toLowerCase()
    // email already exists ?
    // ...
    // payload.entity is found
    /* if (payload.entity) {
      payload.charity = self.getIDfromURN(payload.entity)
      payload.hasRegisteredEntity = payload.charity
      delete payload.entity
    } */
    // informations posted on slack
    global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, {
      'channel': '#cast-members-only',
      'username': 'IndividualRegisterCommand',
      'text': '[' + new Date() + '] - [' + payload.email + '] has just registered into abibao',
      'webhook': nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
    })
    resolve()
  })
}
