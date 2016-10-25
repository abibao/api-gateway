'use strict'

var Promise = require('bluebird')
var Hapi = require('hapi')
var nconf = require('nconf')
var async = require('async')
var Routes = require('../src/server/routes')

global.ABIBAO = {
  nconf: nconf.argv().env().file({ file: 'nconf-deve.json' }),
  services: {},
  debuggers: {
    server: console.log,
    error: console.log
  }
}

module.exports.domain = function () {
  return new Promise(function (resolve) {
    global.ABIBAO.services.domain = {
      execute: function (type, promise, params) {
        return new Promise(function (resolve, reject) {
          global.ABIBAO.services.domain[promise](params).then(resolve).catch(reject)
        })
      },
      administratorLoginWithCredentialsCommand: require('../src/domain/commands/administrator/administratorLoginWithCredentialsCommand')
    }
    resolve()
  })
}

module.exports.server = function () {
  return new Promise(function (resolve) {
    var _server = {
      options: {
        host: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_IP'),
        port: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_PORT'),
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
