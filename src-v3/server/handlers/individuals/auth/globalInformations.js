'use strict'

const Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  jsonp: 'callback',
  handler (request, reply) {
    request.server.methods.query('AuthentificationGlobalInformationsQuery', request.auth.credentials)
      .then((query) => {
        reply(query.result)
      })
      .then((query) => {
        reply(Boom.badRequest(query.error))
      })
  }
}
