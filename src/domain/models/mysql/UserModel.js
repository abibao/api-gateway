'use strict'

module.exports = function () {
  var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  return global.ABIBAO.services.domain.knex.schema.withSchema(database).createTableIfNotExists('users', function (table) {
    table.increments('id')
    table.string('email')
    table.string('charity')
    table.string('registeredCharity')
    table.integer('age')
    table.string('csp')
    table.string('department')
    table.string('gender')
    table.timestamp('modifiedAt')
    table.timestamp('createdAt').defaultTo(global.ABIBAO.services.domain.knex.fn.now())
  })
}
