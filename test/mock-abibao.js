'use strict'

var Promise = require('bluebird')
var Hapi = require('hapi')
var async = require('async')
var Routes = require('../src/server/routes')

global.ABIBAO = {
  config: require('../config'),
  services: {},
  debuggers: {
    domain: console.log,
    server: console.log,
    error: console.log
  }
}

module.exports.domain = function () {
  return new Promise(function (resolve) {
    global.ABIBAO.services.domain = {
      execute: function (type, promise, params) {
        return new Promise(function (resolve) {
          resolve({
            type,
            promise,
            params
          })
        })
      }
    }
    resolve()
  })
}

module.exports.server = function () {
  return new Promise(function (resolve) {
    var _server = {
      options: {
        host: global.ABIBAO.config('ABIBAO_API_GATEWAY_EXPOSE_HOST'),
        port: global.ABIBAO.config('ABIBAO_API_GATEWAY_EXPOSE_PORT'),
        labels: ['api', 'administrator']
      }
    }
    global.ABIBAO.services.server = new Hapi.Server({
      debug: false,
      connections: {
        routes: {
          cors: true
        }
      }
    })
    global.ABIBAO.services.server.logger = console.log
    global.ABIBAO.services.server.connection(_server.options)
    var plugins = ['inert', 'auth']
    async.mapSeries(plugins, function (item, next) {
      require('../src/server/plugins/' + item)(global.ABIBAO.services.server, function () {
        next(null, item)
      })
    }, () => {
      global.ABIBAO.services.server.route(Routes.endpoints)
      resolve()
    })
  })
}
