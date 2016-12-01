'use strict'

class Server {
  constructor (engine) {
    this.type = 'server'
    this.name = 'server'
    this.modules = engine.modules
    this.debug = this.modules.get('debug')('abibao:' + this.type)
    this.error = engine.error
    this.nconf = engine.nconf
    this.options = {
      host: this.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_IP'),
      port: this.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_PORT'),
      labels: ['api', 'administrator']
    }
  }
}

Server.prototype.initialize = function () {
  const Promise = this.modules.get('bluebird')
  return new Promise((resolve, reject) => {
    this.debug('start initializing %o', this.options)
    const Hapi = this.modules.get('hapi')
    this.hapi = new Hapi.Server({
      debug: false,
      connections: {
        routes: {
          cors: true
        }
      }
    })
    this.hapi.connection(this.options)
    const async = this.modules.get('async')
    const plugins = [] // ['inert', 'auth', 'nes']
    async.mapSeries(plugins, (item, next) => {
      require('./../server/plugins/' + item)(this.hapi, function () {
        next(null, item)
      })
    }, (error, results) => {
      if (error) { return reject(error) }
      this.debug('plugins %o', results)
      // this.hapi.auth.default('jwt')
      this.hapi.route(require('./../server/routes').endpoints)
      this.hapi.start(() => {
        resolve()
      })
    })
  })
}

module.exports = Server
