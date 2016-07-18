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
    name: 'individuals',
    paginate: {
      default: 10,
      max: 20
    }
  }

  app.use('individuals', service(options))

  const Service = app.service('individuals')
  Service.before(hooks.before)
  Service.after(hooks.after)
}
