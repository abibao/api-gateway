'use strict'

module.exports = function (domain) {
  const db = domain.nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_SENDGRID')
  return domain.databases.knex.schema.createTableIfNotExists(db + '.bounces', function (table) {
    table.increments('id')
    table.string('rethinkdb')
    table.string('email')
    table.bigInteger('created')
    table.string('reason')
    table.string('status')
  })
}
