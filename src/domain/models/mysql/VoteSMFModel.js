'use strict'

module.exports = function (knex) {
  return knex.schema.createTableIfNotExists('smf_votes', function (table) {
    table.increments('id')
    table.string('email')
    table.bigInteger('startup_id')
    table.string('startup_name')
    table.string('charity_id')
    table.string('charity_name')
    table.integer('points').defaultTo(1)
    table.boolean('converted').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}
