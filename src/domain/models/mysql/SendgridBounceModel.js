'use strict'

module.exports = function () {
  var knex = require('./../../../connections/knex')(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_MVP'))
  return knex.schema.createTableIfNotExists('bounces', function (table) {
    table.increments('id')
    table.string('rethinkdb')
    table.string('email')
    table.bigInteger('created')
    table.string('reason')
    table.string('status')
  })
}
