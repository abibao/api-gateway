'use strict'

var rp = require('request-promise')
var Promise = require('bluebird')

var Hoek = require('hoek')
var Iron = require('iron')
var Base64 = require('base64-url')
var _ = require('lodash')

module.exports = function (sealed) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    sealed = Base64.decode(sealed)
    Iron.unseal(sealed, global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), Iron.defaults, function (err, unsealed) {
      global.ABIBAO.debuggers.server(unsealed)
      // control fingerprint
      switch (true) {
        case _.isNull(err) === false:
          return reject(err)
        case _.isUndefined(unsealed.email):
          return reject(new Error('Email is undefined'))
        case _.isUndefined(unsealed.password):
          return reject(new Error('Password is undefined'))
        case _.isUndefined(unsealed.action):
          return reject(new Error('Action is undefined'))
        case unsealed.action !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION:
          return reject(new Error('Action is unauthorized'))
        default:
          break
      }
      // get individual
      return self.execute('query', 'individualFilterQuery', {email: unsealed.email})
        .then(function (individuals) {
          if (individuals.length === 0) { throw new Error('ERROR_BAD_AUTHENTIFICATION') }
          if (individuals.length > 1) { throw new Error(new Error('Too many emails, contact an individual')) }
          // all done then reply token
          var options = {
            method: 'POST',
            uri: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_URI') + '/auth/local',
            body: {
              email: unsealed.email,
              password: unsealed.password
            },
            headers: {
              'Content-Type': 'application/json'
            },
            json: true
          }
          return rp(options)
        })
        .then(function (result) {
          resolve(result)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  })
}
