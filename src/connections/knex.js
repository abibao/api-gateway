'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

module.exports = function (database) {
  var options = {
    client: 'mysql',
    connection: {
      host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
      port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
      user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
      password: nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'),
      database: database || nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_ANALYTICS')
    },
    debug: false
  }
  if (database === 'EMPTY') {
    delete options.connection.database
  }
  var knex = require('knex')(options)
  return knex
}
