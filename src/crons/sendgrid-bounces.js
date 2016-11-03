'use strict'

// configuration
var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

// setup servicebus
var options = {
  host: config.get('RABBITMQ_ENV_DOCKERCLOUD_SERVICE_FQDN'),
  port: config.get('RABBITMQ_PORT_5672_TCP_PORT'),
  user: 'admin',
  pass: config.get('RABBITMQ_ENV_RABBITMQ_PASS')
}
var url = 'amqp://'
if (options.user && options.pass) {
  url = url + options.user + ':' + options.pass + '@'
}
url = url + options.host + ':' + options.port
var bus = require('servicebus').bus({url})

bus.on('error', (error) => {
  console.log('bus error', error)
  process.exit(1)
})

bus.on('ready', () => {
  console.log('bus ready')
  var count = 1
  setInterval(() => {
    var BUS_EVENT_IS_ALIVE = 'BUS_EVENT_IS_ALIVE' + '_' + config.get('ABIBAO_API_GATEWAY_ENV').toUpperCase()
    console.log('bus.publish on BUS_EVENT_IS_ALIVE')
    bus.publish(BUS_EVENT_IS_ALIVE, {time: Date.now(), count})
    count += 1
  }, 1000)
  // var sendgridListAllEmailsBouncesQuery = require('./../domain/queries/sendgrid/sendgridListAllEmailsBouncesQuery')
})
