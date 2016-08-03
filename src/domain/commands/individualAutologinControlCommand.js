'use strict'

const Promise = require('bluebird')

const Hoek = require('hoek')
const Iron = require('iron')
const Base64 = require('base64-url')
const _ = require('lodash')

module.exports = function (sealed) {
  const self = Hoek.clone(global.ABIBAO.services.domain)
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
      return self.execute('query', 'findIndividualsQuery', {query: {email: unsealed.email}})
        .then(function (individuals) {
          if (individuals.length === 0) { throw new Error('ERROR_BAD_AUTHENTIFICATION') }
          if (individuals.length > 1) { throw new Error(new Error('Too many emails, contact an individual')) }
          return {
            urn: individuals.data[0].id,
            email: unsealed.email,
            password: unsealed.password
          }
        })
        .then(function (result) {
          resolve({command: 'individualAutologinControlCommand', status: 'ok', data: {user: result}})
        })
        .catch(function (error) {
          reject(error)
        })
    })
  })
}
