'use strict'

module.exports = function (domain) {
  const db = domain.nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_ANALYTICS')
  return domain.databases.knex.schema.createTableIfNotExists(db + '.users', function (table) {
    table.increments('id')
    table.string('email')
    table.string('charity')
    table.string('registeredCharity')
    table.integer('age')
    table.string('csp')
    table.string('department')
    table.string('gender')
    table.timestamp('modifiedAt')
    table.timestamp('createdAt').defaultTo(domain.databases.knex.fn.now())
  })
}
