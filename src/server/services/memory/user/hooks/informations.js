'use strict'

const Promise = require('bluebird')

module.exports = function (options) {
  return function (hook) {
    return new Promise(function (resolve, reject) {
      const credentials = {
        urn: hook.id,
        action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
        scope: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL
      }
      global.ABIBAO.services.domain.execute('query', 'authentificationGlobalInformationsQuery', credentials)
        .then(function (result) {
          hook.result = result
          resolve(hook)
        })
        .catch(reject)
    })
  }
}
