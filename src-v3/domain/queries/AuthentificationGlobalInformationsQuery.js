'use strict'

// libraries
const Promise = require('bluebird')

class AuthentificationGlobalInformationsQuery {
  constructor (domain) {
    this.type = 'query'
    this.name = 'authentification-global-informations-query'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.domain = domain
  }
  handler (credentials) {
    const promises = {}
    const database = this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    return new Promise((resolve, reject) => {
      // credentials controls
      credentials.action = credentials.action || 'unauthorized'
      credentials.scope = credentials.scope || 'unauthorized'
      if (credentials.action !== 'ABIBAO_CONST_TOKEN_AUTH_ME') { return reject(new Error('Action is unauthorized')) }
      if (credentials.scope !== 'individual') { return reject(new Error('Scope is unauthorized')) }
      credentials.id = this.domain.getIDfromURN(credentials.urn)
      // load promises
      promises.individual = this.r.db(database).table('individuals').get(credentials.id).run()
      promises.abibaoCompleted = this.r.db(database).table('surveys').filter({'individual': credentials.id, complete: true, isAbibao: true}).run()
      promises.abibaoInProgress = this.r.db(database).table('surveys').filter({'individual': credentials.id, complete: false, isAbibao: true}).run()
      promises.surveysCompleted = this.r.db(database).table('surveys').filter({'individual': credentials.id, complete: true, isAbibao: false}).run()
      promises.surveysInProgress = this.r.db(database).table('surveys').filter({'individual': credentials.id, complete: false, isAbibao: false}).run()
      // execute all
      return Promise.props(promises)
        .then((result) => {
          // controls
          // return
          resolve({
            urn: this.domain.getURNfromID('individual', result.individual.id),
            email: result.individual.email,
            currentCharity: this.domain.getURNfromID('charity', result.individual.charity) || 'none',
            charitiesHistory: [],
            abibaoInProgress: result.abibaoInProgress,
            surveysInProgress: result.surveysInProgress,
            abibaoCompleted: result.abibaoCompleted,
            surveysCompleted: result.surveysCompleted
          })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = AuthentificationGlobalInformationsQuery
