'use strict'

module.exports = function (knex) {
  return knex.schema.createTableIfNotExists('users', function (table) {
    table.increments('id')
    table.string('email')
    table.string('charity')
    table.string('registered_charity')
    table.integer('age')
    table.string('csp')
    table.string('department')
    table.string('gender')
    table.timestamp('modified_at')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}
