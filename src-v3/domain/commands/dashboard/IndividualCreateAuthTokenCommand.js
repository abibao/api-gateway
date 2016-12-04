'use strict'

// libraries
const Promise = require('bluebird')
const JWT = require('jsonwebtoken')

class IndividualCreateAuthTokenCommand {
  constructor (domain) {
    this.type = 'command'
    this.name = 'individual-create-auth-token-command'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.domain = domain
  }
  handler (urn) {
    return new Promise((resolve, reject) => {
      const database = this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
      const id = this.domain.getIDfromURN(urn)
      this.r.db(database).table('individuals').get(id).run()
        .then((individual) => {
          const credentials = {
            action: 'auth_me',
            urn: individual.urn,
            scope: individual.scope
          }
          const token = JWT.sign(credentials, this.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'), { expiresIn: 60 * 60 * 24 })
          resolve(token)
        })
        .catch(reject)
    })
  }
}

module.exports = IndividualCreateAuthTokenCommand
