'use strict'

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
      // control
      switch (true) {
        case _.isNull(err) === false:
          return reject(err)
        case _.isUndefined(unsealed.email):
          return reject(new Error('Email is undefined'))
        case _.isUndefined(unsealed.urnIndividual):
          return reject(new Error('Individual is undefined'))
        case _.isUndefined(unsealed.urnCharity):
          return reject(new Error('Charity is undefined'))
        case _.isUndefined(unsealed.urnCompany):
          return reject(new Error('Company is undefined'))
        case _.isUndefined(unsealed.action):
          return reject(new Error('Action is undefined'))
        case unsealed.action !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_ABIBAO_CAMPAIGN_PUBLISH_AUTO:
          return reject(new Error('Action is unauthorized'))
        default:
          break
      }
      // affect campaign position (3)
      return self.execute('command', 'individualCreateAbibaoSurveyCommand', {email: unsealed.email, target: unsealed.urnIndividual, position: 3})
        .then(function () {
          // affect campaign position (4)
          return self.execute('command', 'individualCreateAbibaoSurveyCommand', {email: unsealed.email, target: unsealed.urnIndividual, position: 4})
            .then(function () {
              resolve({redirect: true})
            })
        })
    })
  })
}
