'use strict'

module.exports = function (knex) {
  return knex.schema.createTableIfNotExists('answers', function (table) {
    table.increments('id')
    table.string('email')
    table.string('campaign_id')
    table.string('charity_id')
    table.string('campaign_name')
    table.string('charity_name')
    table.string('question')
    table.text('answer')
    table.text('answer_text')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}
