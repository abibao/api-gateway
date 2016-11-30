'use strict'

class Engine {
  constructor () {
    const app = require('../package')
    this.type = 'Engine'
    this.name = 'engine'
    this.version = app.version
    this.starttime = new Date()
    this.dependencies = Object.keys(app.dependencies)
    this.cache = {}
  }
  initialize (callback) {
    // caching modules
    this.cache.modules = require('./lib/CacheModules')
    this.dependencies.every((element, index) => {
      this.cache.modules.get(element)
      return true
    })
    // load configurations
    this.nconf = engine.cache.modules.get('nconf').argv().env().file({ file: 'nconf-deve.json' })
    this.configurations = {
      rethinkdbdash: {
        host: this.nconf.get('RETHINKDB_ENV_DOCKERCLOUD_SERVICE_FQDN'),
        port: this.nconf.get('RETHINKDB_PORT_28015_TCP_PORT'),
        user: this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
        password: this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
        silent: false
      }
    }

    // initialize rethinkdb
    this.databases = {}
    this.databases.r = this.cache.modules.get('rethinkdbdash')(this.configurations.rethinkdbdash)
    // end of process
    callback()
  }
}

const engine = new Engine()
engine.initialize(() => {
  console.log('[%s] engine is initialized, mode is [%s]', engine.version, engine.nconf.get('ABIBAO_API_GATEWAY_ENV'))
})
