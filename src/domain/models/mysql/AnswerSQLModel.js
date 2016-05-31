'use strict'

var Promise = require('bluebird')

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.domain,
  error: global.ABIBAO.debuggers.error
}

module.exports = function (knex) {
  return Promise.all([
    knex.schema.createTableIfNotExists('answers', function (table) {
      table.increments('id')
      table.string('email')
      table.string('campaign_id')
      table.string('charity_id')
      table.string('campaign_name')
      table.string('charity_name')
      table.string('question')
      table.string('answer')
      table.string('answer_text')
      table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
  ])
}
