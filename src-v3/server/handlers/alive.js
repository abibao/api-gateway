'use strict'

// libraries
const Boom = require('boom')

module.exports = {
  auth: false,
  jsonp: 'callback',
  handler (request, reply) {
    request.server.methods.query('AliveQuery')
      .then((query) => {
        reply(query.result)
      })
      .catch((query) => {
        reply(Boom.badRequest(query.error))
      })
  }
}
