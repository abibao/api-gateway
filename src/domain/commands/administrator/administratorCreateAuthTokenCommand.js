'use strict'

var Promise = require('bluebird')
var JWT = require('jsonwebtoken')

module.exports = function (urn) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    self.execute('query', 'administratorReadQuery', urn)
      .then(function (administrator) {
        var credentials = {
          action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
          urn: administrator.urn,
          scope: administrator.scope
        }
        var token = JWT.sign(credentials, global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), { expiresIn: 60 * 60 * 24 })
        resolve(token)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
