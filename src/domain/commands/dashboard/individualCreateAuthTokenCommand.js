'use strict'

var Promise = require('bluebird')
var JWT = require('jsonwebtoken')

module.exports = function (urn) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    self.execute('query', 'individualReadQuery', urn).then(function (individual) {
      var credentials = {
        action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
        urn: individual.urn,
        scope: individual.scope
      }
      var token = JWT.sign(credentials, global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'), { expiresIn: 60 * 60 * 24 })
      resolve(token)
    }).catch(function (error) {
      reject(error)
    })
  })
}
