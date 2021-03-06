'use strict'

var Promise = require('bluebird')

var internals = {
  options: {
    host: global.ABIBAO.config('ABIBAO_API_GATEWAY_RABBITMQ_HOST'),
    port: global.ABIBAO.config('ABIBAO_API_GATEWAY_RABBITMQ_PORT'),
    user: global.ABIBAO.config('ABIBAO_API_GATEWAY_RABBITMQ_USER'),
    pass: global.ABIBAO.config('ABIBAO_API_GATEWAY_RABBITMQ_PASS')
  },
  constants: { },
  events: {
    BUS_EVENT_IS_ALIVE: 'BUS_EVENT_IS_ALIVE' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_ANALYTICS_COMPUTE_ANSWER: 'BUS_EVENT_ANALYTICS_COMPUTE_ANSWER' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_ANALYTICS_COMPUTE_USER: 'BUS_EVENT_ANALYTICS_COMPUTE_USER' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_WEBHOOK_SLACK: 'BUS_EVENT_WEBHOOK_SLACK' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO: 'BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_SMF_UPDATE_VOTE: 'BUS_EVENT_SMF_UPDATE_VOTE' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_SENDGRID_CRON_BOUNCES: 'BUS_EVENT_SENDGRID_CRON_BOUNCES' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_SENDGRID_CREATE_BOUNCE_HISTORY: 'BUS_EVENT_SENDGRID_CREATE_BOUNCE_HISTORY' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase(),
    BUS_EVENT_SENDGRID_CREATE_BOUNCE_WORKING: 'BUS_EVENT_SENDGRID_CREATE_BOUNCE_WORKING' + '_' + global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV').toUpperCase()
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
    var url = 'amqp://'
    if (internals.options.user && internals.options.pass) {
      url = url + internals.options.user + ':' + internals.options.pass + '@'
    }
    url = url + internals.options.host + ':' + internals.options.port
    abibao.debug('rabbitmq url=%s', url)
    internals.bus = require('servicebus').bus({url})
    internals.bus.on('error', (error) => {
      reject(error)
    })
    internals.bus.on('ready', () => {
      internals.bus.subscribe(internals.events.BUS_EVENT_IS_ALIVE, require('./handlers/is_alive'), {type: 'fanout', exchangeName: 'amq.fanout'})
      internals.bus.listen(internals.events.BUS_EVENT_SMF_UPDATE_VOTE, require('./handlers/smf_update_vote'))
      internals.bus.listen(internals.events.BUS_EVENT_ANALYTICS_COMPUTE_ANSWER, require('./handlers/analytics_compute_answer'))
      internals.bus.listen(internals.events.BUS_EVENT_ANALYTICS_COMPUTE_USER, require('./handlers/analytics_compute_user'))
      internals.bus.listen(internals.events.BUS_EVENT_WEBHOOK_SLACK, require('./handlers/webhook_slack'))
      internals.bus.listen(internals.events.BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO, require('./handlers/email_abibao_affect_campaigns_auto'))
      internals.bus.listen(internals.events.BUS_EVENT_SENDGRID_CRON_BOUNCES, require('./handlers/sendgrid_crons_bounces'))
      internals.bus.listen(internals.events.BUS_EVENT_SENDGRID_CREATE_BOUNCE_HISTORY, require('./handlers/sendgrid_create_bounce_history'))
      internals.bus.listen(internals.events.BUS_EVENT_SENDGRID_CREATE_BOUNCE_WORKING, require('./handlers/sendgrid_create_bounce_working'))
      resolve()
    })
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
