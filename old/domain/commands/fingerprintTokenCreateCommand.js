'use strict'

var Promise = require('bluebird')

var nconf = global.ABIBAO.nconf
var Iron = require('iron')
var Base64 = require('base64-url')

module.exports = function (payload) {
  return new Promise(function (resolve, reject) {
    var sealed = ''
    Iron.seal(payload, nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), Iron.defaults, function (error, result) {
      if (error) { return reject(new Error(error)) }
      sealed = Base64.encode(result)
      global.ABIBAO.debuggers.domain('fingerprint=%s', sealed)
      resolve(sealed)
    })
  })
}
