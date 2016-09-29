'use strict'

/* *****
send / listen for 1:1
publish / subscribe for 1:N
***** */

var Promise = require('bluebird')

var internals = {
  options: {
    url: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_RABBITMQ_URL')
  },
  constants: { },
  events: {
    BUS_EVENT_IS_ALIVE: 'BUS_EVENT_IS_ALIVE' + '_' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_ANALYTICS_COMPUTE_ANSWER: 'BUS_EVENT_ANALYTICS_COMPUTE_ANSWER' + '_' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_ANALYTICS_COMPUTE_USER: 'BUS_EVENT_ANALYTICS_COMPUTE_USER' + '_' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_WEBHOOK_SLACK: 'BUS_EVENT_WEBHOOK_SLACK' + '_' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO: 'BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO' + '_' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_SMF_UPDATE_VOTE: 'BUS_EVENT_SMF_UPDATE_VOTE' + '_' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV').toUpperCase()
  },
  bus: false
}

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.bus,
  error: global.ABIBAO.debuggers.error
}

internals.initialize = function () {
  abibao.debug('start initializing')
  return new Promise(function (resolve, reject) {
    internals.bus = require('servicebus').bus(internals.options)
    internals.bus.subscribe(internals.events.BUS_EVENT_IS_ALIVE, require('./handlers/is_alive'))
    internals.bus.listen(internals.events.BUS_EVENT_SMF_UPDATE_VOTE, require('./handlers/smf_update_vote'))
    internals.bus.listen(internals.events.BUS_EVENT_ANALYTICS_COMPUTE_ANSWER, require('./handlers/analytics_compute_answer'))
    internals.bus.listen(internals.events.BUS_EVENT_ANALYTICS_COMPUTE_USER, require('./handlers/analytics_compute_user'))
    internals.bus.listen(internals.events.BUS_EVENT_WEBHOOK_SLACK, require('./handlers/webhook_slack'))
    internals.bus.listen(internals.events.BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO, require('./handlers/email_abibao_affect_campaigns_auto'))
    resolve()
  })
}

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.bus !== false) { resolve() }
    internals.bus = { }
    internals.initialize()
      .then(function () {
        global.ABIBAO.services.bus = internals.bus
        global.ABIBAO.events.BusEvent = internals.events
        global.ABIBAO.events.BusConstant = internals.constants
        abibao.debug(global.ABIBAO.events.BusEvent)
        resolve()
      })
      .catch(function (error) {
        internals.bus = false
        abibao.error(error)
        reject(error)
      })
  })
}
