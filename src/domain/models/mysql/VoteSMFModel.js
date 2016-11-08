'use strict'

module.exports = function () {
  var knex = require('./../../../connections/knex')()
  return knex.schema.createTableIfNotExists('smf_votes', function (table) {
    table.increments('id')
    table.string('email')
    table.bigInteger('startup_id')
    table.string('startup_name')
    table.string('charity_id')
    table.string('charity_name')
    table.integer('points').defaultTo(1)
    table.boolean('converted').defaultTo(false)
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}
