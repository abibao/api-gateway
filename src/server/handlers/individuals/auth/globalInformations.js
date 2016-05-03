'use strict'

var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Retourne des informations rapides sur l"utilisateur actuellement connecté',
  notes: 'Retourne des informations rapides sur l"utilisateur actuellement connecté',
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('query', 'authentificationGlobalInformationsQuery', request.auth.credentials)
      .then(function (user) {
        reply(user)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
