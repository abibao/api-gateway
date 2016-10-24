'use strict'

var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('query', 'authentificationGlobalInformationsQuery', request.auth.credentials)
      .then(function (user) {
        reply(user)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
