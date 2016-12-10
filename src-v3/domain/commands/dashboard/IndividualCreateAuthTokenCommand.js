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
  handler (id) {
    const database = this.nconf.get('ABIBAO_API_GATEWAY_DATABASES_RETHINKDB_MVP')
    return new Promise((resolve, reject) => {
      this.r.db(database).table('individuals').get(id).run()
        .then((individual) => {
          const credentials = {
            action: 'ABIBAO_CONST_TOKEN_AUTH_ME',
            urn: this.domain.getURNfromID('individual', individual.id),
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
