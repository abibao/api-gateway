'use strict'

var Promise = require('bluebird')

var nconf = global.ABIBAO.nconf
var Hoek = require('hoek')
var Iron = require('iron')
var Base64 = require('base64-url')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.execute('query', 'individualReadQuery', payload.urn)
        .then(function (individual) {
          if (payload.email !== individual.email) { throw new Error('ERROR_FINGERPRINT_EMAIL_VERIFICATION') }
          var fingerprint = {
            action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_FINGERPRINT,
            urn: individual.urn,
            email: individual.email
          }
          var sealed = ''
          Iron.seal(fingerprint, nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), Iron.defaults, function (error, result) {
            if (error) { throw new Error(error) }
            sealed = Base64.encode(result)
            global.ABIBAO.debuggers.domain('sealed=%s', sealed)
            resolve(sealed)
          })
        })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
