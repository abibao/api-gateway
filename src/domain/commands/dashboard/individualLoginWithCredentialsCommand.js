'use strict'

var Promise = require('bluebird')

module.exports = function (payload) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    // email to lowercase
    payload.email = payload.email.toLowerCase()
    self.execute('query', 'individualFilterQuery', {email: payload.email}).then(function (individuals) {
      if (individuals.length === 0) { throw new Error('ERROR_BAD_AUTHENTIFICATION') }
      if (individuals.length > 1) { throw new Error(new Error('Too many emails, contact an individual')) }
      var individual = individuals[0]
      if (individual.authenticate(payload.password)) {
        // all done then reply token
        self.execute('command', 'individualCreateAuthTokenCommand', individual.urn)
          .then(function (token) {
            var credentials = {
              action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
              urn: individual.urn,
              scope: individual.scope
            }
            return self.execute('query', 'authentificationGlobalInformationsQuery', credentials).then(function (infos) {
              if (infos.abibaoCompleted.length === 0 && infos.abibaoInProgress.length === 0) {
                return self.execute('command', 'individualCreateAbibaoSurveyCommand', {email: payload.email, target: infos.urn, position: 1}).then(function () {
                  return self.execute('command', 'individualCreateAbibaoSurveyCommand', {email: payload.email, target: infos.urn, position: 2}).then(function () {
                    return self.execute('query', 'authentificationGlobalInformationsQuery', credentials).then(function (infos) {
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
      } else {
        reject('ERROR_BAD_AUTHENTIFICATION')
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}
