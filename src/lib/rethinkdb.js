'use strict'

const rethink = require('rethinkdbdash')

// load environnement configuration
var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

const r = rethink({
  host: config.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST'),
  port: config.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
  db: config.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
  user: config.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
  password: config.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
  authKey: config.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  discovery: false,
  silent: true
})

module.exports.r = r
