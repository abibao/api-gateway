'use strict'

module.exports = {
  auth: false,
  jsonp: 'callback',
  handler (request, reply) {
    request.server.methods.query('AliveQuery')
      .then((result) => {
        reply(result)
      })
      .catch(function (error) {
        const Boom = request.server.methods.modules.get('boom')
        reply(Boom.badRequest(error))
      })
  }
}
