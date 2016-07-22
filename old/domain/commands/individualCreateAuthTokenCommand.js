'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')
var JWT = require('jsonwebtoken')

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.execute('query', 'individualReadQuery', urn).then(function (individual) {
        var credentials = {
          action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
          urn: individual.urn,
          scope: individual.scope
        }
        var token = JWT.sign(credentials, global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), { expiresIn: 60 * 60 * 24 })
        resolve(token)
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
