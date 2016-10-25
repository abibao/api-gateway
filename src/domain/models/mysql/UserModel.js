'use strict'

module.exports = function (knex, database) {
  return knex.schema.withSchema(database).createTableIfNotExists('users', function (table) {
    table.increments('id')
    table.string('email')
    table.string('charity')
    table.string('registeredCharity')
    table.integer('age')
    table.string('csp')
    table.string('department')
    table.string('gender')
    table.timestamp('modifiedAt')
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}
