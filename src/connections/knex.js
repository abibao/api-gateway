'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var options = {
  client: 'mysql',
  connection: {
    host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
    port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD')
  },
  debug: false
}

module.exports = function() {
  return new Promise((resolve, reject) => {
    var knex = require('knex')(options)
    knex.raw('CREATE SCHEMA IF NOT EXISTS `' + nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE') + '` DEFAULT CHARACTER SET utf8;')
      .then(() => {
        options.connection.database = nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
        knex.destroy()
        .then(() => {
           knex = require('knex')(options)
           resolve(knex)
        }).catch(reject)
      }).catch(reject)
  })
}
