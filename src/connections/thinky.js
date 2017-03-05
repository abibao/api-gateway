'use strict'

var config = require('../../config')

var options = {
  host: config('ABIBAO_API_GATEWAY_RETHINKDB_HOST'),
  port: config('ABIBAO_API_GATEWAY_RETHINKDB_PORT'),
  db: config('ABIBAO_API_GATEWAY_RETHINKDB_DATABASE'),
  user: config('ABIBAO_API_GATEWAY_RETHINKDB_USER'),
  password: config('ABIBAO_API_GATEWAY_RETHINKDB_PASS'),
  silent: true
}
var thinky = require('thinky')(options)

module.exports = thinky
