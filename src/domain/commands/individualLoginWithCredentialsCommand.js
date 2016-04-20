'use strict'

var Promise = require('bluebird')

module.exports = function (payload) {
  var self = this

  return new Promise(function (resolve, reject) {
    try {
      self.execute('query', 'individualFilterQuery', {email: payload.email}).then(function (individuals) {
        if (individuals.length === 0) {
          return reject('ERROR_BAD_AUTHENTIFICATION')
        }
        if (individuals.length > 1) {
          return reject(new Error('Too many emails, contact an individual'))
        }
        var individual = individuals[0]
        if (individual.authenticate(payload.password)) {
          // all done then reply token
          self.execute('command', 'individualCreateAuthTokenCommand', individual.urn).then(function (token) {
            var credentials = {
              action: self.ABIBAO_CONST_TOKEN_AUTH_ME,
              urn: individual.urn,
              scope: individual.scope
            }
            return self.execute('query', 'authentificationGlobalInformationsQuery', credentials).then(function (infos) {
              if (infos.abibaoCompleted.length === 0 && infos.abibaoInProgress.length === 0) {
                return self.execute('command', 'individualCreateAbibaoSurveyCommand', {target: infos.urn, position: 1}).then(function () {
                  return self.execute('command', 'individualCreateAbibaoSurveyCommand', {target: infos.urn, position: 2}).then(function () {
                    return self.execute('query', 'authentificationGlobalInformationsQuery', credentials).then(function (infos) {
                      resolve({token: token, globalInfos: infos})
                    })
                  })
                })
              } else {
                resolve({token: token, globalInfos: infos})
              }
            })
          })
            .catch(function (error) {
              reject(error)
            })
        } else {
          reject('ERROR_BAD_AUTHENTIFICATION')
        }
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
