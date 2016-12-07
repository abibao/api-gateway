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
    this.domain = domain
  }
  handler (payload) {
    const credentials = {}
    let token = ''
    const database = this.nconf.get('ABIBAO_API_GATEWAY_DATABASES_RETHINKDB_MVP')
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
    return new Promise((resolve, reject) => {
      // validate payload
      validate(payload, schema)
        .then(() => {
          // find individual by email
          payload.email = payload.email.toLowerCase()
          return this.r.db(database).table('individuals').filter({email: payload.email}).run()
        })
        .then((individuals) => {
          if (individuals.length === 0) { throw new Error('ERROR_BAD_AUTHENTIFICATION') }
          let result = individuals[0]
          let individual = this.domain.IndividualModel.transform(result)
          credentials.urn = individual.urn
          credentials.scope = individual.scope
          // verifying password
          if (this.domain.IndividualModel.authenticate(payload.password, result)) {
            individual.id = this.domain.getIDfromURN(individual.urn)
            // create a server side token
            return this.domain.execute('Command', 'IndividualCreateAuthTokenCommand', individual.id)
          } else {
            reject(new Error('ERROR_BAD_AUTHENTIFICATION'))
          }
        })
        .then((command) => {
          token = command.result
          credentials.action = 'ABIBAO_CONST_TOKEN_AUTH_ME'
          // get globalInfos about an individual
          return this.domain.execute('Command', 'AuthentificationGlobalInformationsQuery', credentials)
        })
        .then((command) => {
          const infos = command.result
          // assign campaigns 1 and 2 of abibao if needed
          if (infos.abibaoCompleted.length === 0 && infos.abibaoInProgress.length === 0) {
            const promises = {}
            promises.a = this.domain.execute('Command', 'IndividualCreateAbibaoSurveyCommand', {email: infos.email, position: 1})
            promises.b = this.domain.execute('Command', 'IndividualCreateAbibaoSurveyCommand', {email: infos.email, position: 2})
            return Promise.props(promises)
          } else {
            return {
              a: false,
              b: false,
              infos
            }
          }
        })
        .then(() => {
          return this.domain.execute('Command', 'AuthentificationGlobalInformationsQuery', credentials)
        })
        .then((query) => {
          resolve({
            token,
            globalInfos: query.result
          })
        })
        .catch((error) => {
          reject(error)
        })
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
