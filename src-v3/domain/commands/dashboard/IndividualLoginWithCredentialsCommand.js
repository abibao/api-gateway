'use strict'

// libraries
const Promise = require('bluebird')
const Joi = require('joi')
const validate = Promise.promisify(Joi.validate)

class IndividualLoginWithCredentialsCommand {
  constructor (domain) {
    this.type = 'command'
    this.name = 'individual-login-with-credentials-command'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.individualModel = domain.IndividualModel
    this.domain = domain
  }
  handler (payload) {
    return new Promise((resolve, reject) => {
      const database = this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
      // validate payload
      validate(payload, schema)
        .then((result) => {
          // find individual by email
          payload.email = payload.email.toLowerCase()
          return this.r.db(database).table('individuals').filter({email: payload.email}).run()
        })
        .then((individuals) => {
          if (individuals.length === 0) { throw new Error('ERROR_BAD_AUTHENTIFICATION') }
          let result = individuals[0]
          let individual = this.individualModel.transform(result)
          // verifying password
          if (this.individualModel.authenticate(payload.password, result)) {
            return this.domain.execute('Command', 'IndividualCreateAuthTokenCommand', individual.urn)
          } else {
            reject(new Error('ERROR_BAD_AUTHENTIFICATION'))
          }
        })
        .then((command) => {
          return this.domain.execute('Command', 'AuthentificationGlobalInformationsQuery', command.result)
        })
        .then((command) => {
          resolve(command.result)
        })
        .catch((error) => {
          reject(error)
        })
      // --- assign abibao campaigns 1 and 2 if not already done
      // --- then return globalInfos and token
    })
  }
}

module.exports = IndividualLoginWithCredentialsCommand

/**

const Promise = require('bluebird')
const Hoek = require('hoek')

module.exports = function (payload) {
  const self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    // email to lowercase
    payload.email = payload.email.toLowerCase()
    self.execute('query', 'individualFilterQuery', {email: payload.email}).then(function (individuals) {
      if (individuals.length === 0) { throw new Error('ERROR_BAD_AUTHENTIFICATION') }
      if (individuals.length > 1) { throw new Error(new Error('Too many emails, contact an individual')) }
      const individual = individuals[0]
      if (individual.authenticate(payload.password)) {
        // all done then reply token
        self.execute('command', 'individualCreateAuthTokenCommand', individual.urn)
          .then(function (token) {
            const credentials = {
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
