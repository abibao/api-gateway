'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

module.exports = function (database) {
  var options = {
    host: nconf.get('RETHINKDB_ENV_DOCKERCLOUD_SERVICE_FQDN'),
    port: nconf.get('RETHINKDB_PORT_28015_TCP_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
    password: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
    authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
    db: database || nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
    silent: true
  }
  if (database === 'EMPTY') {
    delete options.db
  }
  var r = require('rethinkdbdash')(options)
  return r
}
