'use strict'

// debugs
const _debug = require('debug')('abibao:server')

// libraries
const Promise = require('bluebird')
const Hapi = require('hapi')
const async = require('async')

// internals
const routes = require('./../server/routes')

class Server {
  constructor (engine) {
    this.type = 'server'
    this.name = 'server'
    this.debug = _debug
    this.error = engine.error
    this.nconf = engine.nconf
    this.options = {
      host: this.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_IP'),
      port: this.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_PORT'),
      labels: ['api', 'administrator']
    }
    this.hapi = new Hapi.Server({
      debug: false,
      connections: {
        routes: {
          cors: true
        }
      }
    })
    this.hapi.method({
      name: 'command',
      method: (name, params) => {
        return engine.domain.execute('Command', name, params)
      }
    })
    this.hapi.method({
      name: 'query',
      method: (name, params) => {
        return engine.domain.execute('Query', name, params)
      }
    })
  }
}

Server.prototype.initialize = function () {
  return new Promise((resolve, reject) => {
    this.debug('start initializing %o', this.options)
    this.hapi.connection(this.options)
    const plugins = ['auth']
    async.mapSeries(plugins, (item, next) => {
      require('./../server/plugins/' + item)(this, function () {
        next(null, item)
      })
    }, (error, results) => {
      if (error) { return reject(error) }
      this.debug('plugins %o', results)
      // this.hapi.auth.default('jwt')
      this.hapi.route(routes.endpoints)
      this.hapi.start(() => {
        resolve()
      })
    })
  })
}

module.exports = Server
