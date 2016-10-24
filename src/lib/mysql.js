'use strict'

// load environnement configuration
var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_HOST'),
    port: config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PORT'),
    user: config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PASSWORD')
  },
  debug: false
})

module.exports.knex = knex
