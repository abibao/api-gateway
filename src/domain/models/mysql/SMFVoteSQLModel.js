'use strict'

var Promise = require('bluebird')

module.exports = function (knex) {
  return Promise.all([
    knex.schema.createTableIfNotExists('smf_votes', function (table) {
      table.increments('id')
      table.string('email')
      table.bigInteger('startup_id')
      table.string('startup_name')
      table.string('charity_name')
      table.integer('points')
      table.boolean('converted')
      table.timestamp('convertedAt')
      table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
  ])
}
