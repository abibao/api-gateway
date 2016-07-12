'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

const service = require('feathers-rethinkdb')
const hooks = require('./hooks')

// rethinkdb connector
const r = require('rethinkdbdash')({
  silent: true,
  host: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST'),
  port: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  db: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
})

module.exports = function () {
  const app = this

  const options = {
    Model: r,
    name: 'administrators',
    paginate: {
      default: 10,
      max: 20
    }
  }

  // Initialize our service with any options it requires
  app.use('/v1/administrators', service(options))

  // Get our initialize service to that we can bind hooks
  const administratorsService = app.service('/v1/administrators')

  // Set up our before hooks
  administratorsService.before(hooks.before)

  // Set up our after hooks
  administratorsService.after(hooks.after)
}
