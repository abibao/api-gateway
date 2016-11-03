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
var context = require('rabbit.js').createContext(url)

context.on('error', (error) => {
  console.log('bus error', error)
  process.exit(1)
})

context.on('ready', () => {
  console.log('bus ready')
  var sub = context.socket('PUSH')

  // serup cron
  var CronJob = require('cron').CronJob
  new CronJob('*/60 * * * * *', function () {
    console.log('You will see this message every second')
    var sendgridListAllEmailsBouncesQuery = require('./../domain/queries/sendgrid/sendgridListAllEmailsBouncesQuery')
    bus.publish('BUS_EVENT_IS_ALIVE', {})
  }, null, true, 'Europe/Paris')
})
