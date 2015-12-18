"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.status = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', 'surveys'],
  description: 'Returns a JSON object with status either “working”, “live” or “closed”.',
  notes: 'Returns a JSON object with status either “working”, “live” or “closed”.',
  validate: {
    params: {
      id: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    try {
      var result = {
        "status": "working, live, closed"
      };
      reply(result);
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.badRequest(error));
    }
  }
};

exports.create = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', 'surveys'],
  description: 'Creates an empty survey with the parameter name.',
  notes: 'Creates an empty survey with the parameter name.',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      name: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    try {
      var result = {
        "id": 18569,
        "published" : "true or false",
        "status": "working, live, closed",
        "creator": "team@abibao.com",
        "name": "First tour"
      };
      reply(result);
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.badRequest(error));
    }
  }
};