'use strict'

var config = require('../../config')

// setup servicebus
var options = {
  host: config('ABIBAO_API_GATEWAY_RABBITMQ_HOST'),
  port: config('ABIBAO_API_GATEWAY_RABBITMQ_PORT'),
  user: config('ABIBAO_API_GATEWAY_RABBITMQ_USER'),
  pass: config('ABIBAO_API_GATEWAY_RABBITMQ_PASS')
}
var url = 'amqp://'
if (options.user && options.pass) {
  url = url + options.user + ':' + options.pass + '@'
}
url = url + options.host + ':' + options.port
var bus = require('servicebus').bus({url})

// setup events
var BUS_EVENT_SENDGRID_CRON_BOUNCES = 'BUS_EVENT_SENDGRID_CRON_BOUNCES' + '_' + config('ABIBAO_API_GATEWAY_ENV').toUpperCase()

// on error
bus.on('error', (error) => {
  console.log('bus error', error)
  process.exit(1)
})

// on ready
bus.on('ready', () => {
  console.log('work in progress')
  bus.send(BUS_EVENT_SENDGRID_CRON_BOUNCES, {time: Date.now()})
  setTimeout(() => {
    process.exit(0)
  }, 2000)
})
