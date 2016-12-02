'use strict'

class IndividualLoginWithCredentialsCommand {
  constructor (domain) {
    this.type = 'command'
    this.name = 'individual-login-with-credentials-command'
    this.modules = domain.modules
    this.nconf = domain.nconf
  }
}

IndividualLoginWithCredentialsCommand.prototype.handler = function (payload) {
  const Promise = this.modules.get('bluebird')
  return new Promise((resolve, reject) => {
    payload.email = payload.email.toLowerCase()
    // get the entry for this email
    // if one entry is found
    // --- assign abibao campaigns 1 and 2 if not already done
    // --- then return globalInfos and token
    resolve({login: true})
  })
}

module.exports = IndividualLoginWithCredentialsCommand

/**

var Promise = require('bluebird')
var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
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

**/
