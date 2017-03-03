'use strict'

var Promise = require('bluebird')
var Iron = require('iron')
var Base64 = require('base64-url')
var _ = require('lodash')

module.exports = function (sealed) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    sealed = Base64.decode(sealed)
    Iron.unseal(sealed, global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'), Iron.defaults, function (err, unsealed) {
      // control
      switch (true) {
        case _.isNull(err) === false:
          return reject(err)
        case _.isUndefined(unsealed.email):
          return reject(new Error('Email is undefined'))
        case _.isUndefined(unsealed.individual):
          return reject(new Error('Individual is undefined'))
        case _.isUndefined(unsealed.charity):
          return reject(new Error('Charity is undefined'))
        case _.isUndefined(unsealed.campaign):
          return reject(new Error('Campaign is undefined'))
        case _.isUndefined(unsealed.action):
          return reject(new Error('Action is undefined'))
        case unsealed.action !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_ABIBAO_CAMPAIGN_PUBLISH_AUTO:
          return reject(new Error('Action is unauthorized'))
        default:
          break
      }
      self.execute('command', 'individualCreateSurveyCommand', {campaign: unsealed.campaign, individual: unsealed.individual, charity: unsealed.charity})
        .then(function () {
          return self.execute('command', 'individualCreateFingerprintTokenCommand', {urn: unsealed.individual, email: unsealed.email})
            .then((fingerprint) => {
              resolve({fingerprint})
            })
        })
        .catch(reject)
    })
  })
}
