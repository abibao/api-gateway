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
          case _.isUndefined(unsealed.email):
            return reject(new Error('Email is undefined'))
          case _.isUndefined(unsealed.urn):
            return reject(new Error('Individual is undefined'))
          case _.isUndefined(unsealed.action):
            return reject(new Error('Action is undefined'))
          case unsealed.action !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_FINGERPRINT:
            return reject(new Error('Action is unauthorized'))
          default:
            break
        }
        // get individual
        self.execute('query', 'individualFilterQuery', {email: unsealed.email})
          .then(function (individuals) {
            if (individuals.length === 0) { throw new Error('ERROR_BAD_AUTHENTIFICATION') }
            if (individuals.length > 1) { throw new Error(new Error('Too many emails, contact an individual')) }
            var individual = individuals[0]
            // all done then reply token
            self.execute('command', 'individualCreateAuthTokenCommand', individual.urn)
              .then(function (token) {
                var credentials = {
                  action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
                  urn: individual.urn,
                  scope: individual.scope
                }
                return self.execute('query', 'authentificationGlobalInformationsQuery', credentials)
                  .then(function (infos) {
                    if (infos.abibaoCompleted.length === 0 && infos.abibaoInProgress.length === 0) {
                      return self.execute('command', 'individualCreateAbibaoSurveyCommand', {email: unsealed.email, target: unsealed.urn, position: 1})
                        .then(function () {
                          return self.execute('command', 'individualCreateAbibaoSurveyCommand', {email: unsealed.email, target: unsealed.urn, position: 2})
                            .then(function () {
                              return self.execute('query', 'authentificationGlobalInformationsQuery', credentials)
                                .then(function (infos) {
                                  resolve({token, globalInfos: infos})
                                })
                            })
                        })
                    } else {
                      resolve({token, globalInfos: infos})
                    }
                  })
              })
              .catch(function (error) {
                reject(error)
              })
          })
      })
    } catch (e) {
      reject(e)
    }
  })
}
