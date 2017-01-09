'use strict'

const Boom = require('boom')

module.exports.create = {
  auth: false,
  payload: {
    allow: ['application/x-www-form-urlencoded', 'application/json']
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.databases.mvp.CampaignItem.upsert(request.payload)
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
    global.ABIBAO.services.domain.databases.mvp.CampaignItem.findAndCount({ offset: parseInt(request.query.offset) || 0, limit: parseInt(request.query.limit) || 20 })
      .then(function (result) {
        reply({
          total: result.count,
          offset: parseInt(request.query.offset) || 0,
          limit: parseInt(request.query.limit) || 20,
          data: result.rows
        })
      })
      .catch(function (error) {
        console.log(error)
        reply(Boom.badRequest(error))
      })
  }
}
