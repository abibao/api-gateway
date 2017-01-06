'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

module.exports = function (database) {
  var Sequelize = require('sequelize')
  var sequelize = new Sequelize(database, nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'), nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'), {
    host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
    port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
    logging: global.ABIBAO.debuggers.domain,
    dialect: 'mysql'
  })
  return sequelize
}
