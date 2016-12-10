'use strict'

// debugs
const _debug = require('debug')('abibao:engine')
const _error = require('debug')('abibao:error')

// libraries
const Promise = require('bluebird')
const nconf = require('nconf').argv().env().file({ file: 'nconf-deve.json' })

// internals
const Domain = require('./Domain')
const Server = require('./Server')

class Engine {
  constructor () {
    this.type = 'engine'
    this.name = 'engine'
    this.debug = _debug
    this.error = _error
    this.version = process.env['npm_package_version']
    this.starttime = new Date()
    this.databases = {}
    // initialize databases via internal modules loader, to avoid tests failure
    this.modules = {
      get: (name) => {
        this.debug('start database %s', name)
        return require(name)
      }
    }
  }
  initialize () {
    this.debug('initialize started')
    // load configurations
    this.nconf = nconf
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
    this.databases.r = this.modules.get('rethinkdbdash')(this.configurations.rethinkdb)
    this.databases.knex = this.modules.get('knex')(this.configurations.mysql)
    // initializers
    this.domain = new Domain(this)
    this.server = new Server(this)
    const promises = [this.domain.initialize(), this.server.initialize()]
    return Promise.all(promises)
  }
}

module.exports = Engine
