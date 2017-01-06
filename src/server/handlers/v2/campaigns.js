'use strict'

var Boom = require('boom')

module.exports.create = {
  auth: false,
  payload: {
    allow: ['application/x-www-form-urlencoded', 'application/json']
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.Campaign.upsert(request.payload)
      .then(function (result) {
        reply(result)
      })
      .catch(function (error) {
        console.log(error)
        reply(Boom.badRequest(error))
      })
  }
}

module.exports.list = {
  auth: false,
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.Campaign.findAndCount({ offset: 5, limit: 5 })
      .then(function (result) {
        reply(result)
      })
      .catch(function (error) {
        console.log(error)
        reply(Boom.badRequest(error))
      })
  }
}
