'use strict'

module.exports = function (domain) {
  const db = domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  return domain.databases.knex.schema.createTableIfNotExists(db + '.smf_votes', function (table) {
    table.increments('id')
    table.string('email')
    table.bigInteger('startup_id')
    table.string('startup_name')
    table.string('charity_id')
    table.string('charity_name')
    table.integer('points').defaultTo(1)
    table.boolean('converted').defaultTo(false)
    table.timestamp('createdAt').defaultTo(domain.databases.knex.fn.now())
  })
}
