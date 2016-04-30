'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')
var Iron = require('iron')
var Base64 = require('base64-url')
var _ = require('lodash')

module.exports = function (sealed) {
  var self = Hoek.clone(global.ABIBAO.services.domain)

  return new Promise(function (resolve, reject) {
    try {
      sealed = Base64.decode(sealed)
      Iron.unseal(sealed, global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), Iron.defaults, function (err, unsealed) {
        // control
        switch (true) {
          case _.isNull(err) === false:
            return reject(err)
          case _.isUndefined(unsealed.individual):
            return reject(new Error('Individual is undefined'))
          case _.isUndefined(unsealed.campaign):
            return reject(new Error('Campaign is undefined'))
          case _.isUndefined(unsealed.action):
            return reject(new Error('Action is undefined'))
          case unsealed.action !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH:
            return reject(new Error('Action is unauthorized'))
          default:
            break
        }
        // continue
        var data = {
          campaign: unsealed.campaign,
          company: unsealed.company,
          charity: unsealed.charity,
          individual: unsealed.individual
        }
        var survey
        self.execute('query', 'surveyFilterQuery', data).then(function (surveys) {
          if (surveys.length === 0) {
            return self.execute('command', 'surveyCreateCommand', data).then(function (survey) {
              return self.execute('command', 'individualCreateAuthTokenCommand', survey.urnIndividual).then(function (token) {
                survey.token = token
                delete survey.campaign
                delete survey.company
                delete survey.charity
                delete survey.individual
                resolve(survey)
              })
            })
          } else {
            survey = surveys[0]
            return self.execute('command', 'individualCreateAuthTokenCommand', survey.urnIndividual).then(function (token) {
              survey.token = token
              delete survey.campaign
              delete survey.company
              delete survey.charity
              delete survey.individual
              resolve(survey)
            })
          }
        })
          .catch(function (error) {
            reject(error)
          })
      })
    } catch (e) {
      reject(e)
    }
  })
}
