'use strict'

module.exports = function () {
  var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  return global.ABIBAO.services.domain.knex.schema.withSchema(database).createTableIfNotExists('answers', function (table) {
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
