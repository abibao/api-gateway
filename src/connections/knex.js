'use strict'

var config = require('../../config')

module.exports = function () {
  var options = {
    client: 'pg',
    connection: {
      host: config('ABIBAO_API_GATEWAY_POSTGRES_HOST'),
      port: config('ABIBAO_API_GATEWAY_POSTGRES_PORT'),
      user: config('ABIBAO_API_GATEWAY_POSTGRES_USER'),
      password: config('ABIBAO_API_GATEWAY_POSTGRES_PASS'),
      database: config('ABIBAO_API_GATEWAY_POSTGRES_DATABASE')
    },
    debug: false
  }
  var knex = require('knex')(options)
  return knex
}
