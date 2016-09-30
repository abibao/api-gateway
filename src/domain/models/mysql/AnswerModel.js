'use strict'

module.exports = function () {
  return global.ABIBAO.services.domain.knex.schema.createTableIfNotExists('answers', function (table) {
    table.increments('id')
    table.string('email')
    table.string('campaign_id')
    table.string('charity_id')
    table.string('campaign_name')
    table.string('charity_name')
    table.string('question')
    table.string('answer')
    table.string('answer_text')
    table.timestamp('createdAt').defaultTo(global.ABIBAO.services.domain.knex.fn.now())
  })
}
