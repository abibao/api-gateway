'use strict'

class Engine {
  constructor () {
    this.type = 'engine'
    this.name = 'engine'
    this.version = process.env.npm_package_version
    this.starttime = new Date()
    this.modules = require('./NodeModules')
    this.debug = this.modules.get('debug')('abibao:' + this.type)
    this.error = this.modules.get('debug')('abibao:error')
  }
  initialize () {
    this.debug('initialize started')
    // load configurations
    this.nconf = this.modules.get('nconf').argv().env().file({ file: 'nconf-deve.json' })
    this.configurations = {
      rethinkdb: {
        host: this.nconf.get('RETHINKDB_ENV_DOCKERCLOUD_SERVICE_FQDN'),
        port: this.nconf.get('RETHINKDB_PORT_28015_TCP_PORT'),
        user: this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
        password: this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
        silent: true
      },
      mysql: {
        client: 'mysql',
        connection: {
          host: this.nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
          port: this.nconf.get('MYSQL_PORT_3306_TCP_PORT'),
          user: this.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
          password: this.nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD')
        },
        debug: false
      }
    }
    // initialize databases
    this.databases = {}
    this.databases.r = this.modules.get('rethinkdbdash')(this.configurations.rethinkdb)
    this.databases.thinky = this.modules.get('thinky')(this.configurations.rethinkdb)
    this.databases.knex = this.modules.get('knex')(this.configurations.mysql)
    // initializers
    const Promise = this.modules.get('bluebird')
    const Domain = require('./Domain')
    const Server = require('./Server')
    this.domain = new Domain(this)
    this.server = new Server(this)
    const promises = [this.domain.initialize(), this.server.initialize()]
    return Promise.all(promises)
  }
}

module.exports = Engine
