'use strict'

module.exports = function () {
  var knex = require('./../../../connections/knex')('sendgrid')
  return knex.schema.createTableIfNotExists('bounces', function (table) {
    table.increments('id')
    table.string('rethinkdb')
    table.string('email')
    table.bigInteger('created')
    table.string('reason')
    table.string('status')
  })
}
