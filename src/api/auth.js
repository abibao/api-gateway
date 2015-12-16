"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.me = {
  auth: 'jwt',
  tags: ['api', 'auth'],
  description: 'Returns currently authenticated user.',
  notes: 'Returns currently authenticated user.',
  jsonp: 'callback',
  handler: function(request, reply) {
    reply(request.auth.credentials);
  }
};

exports.surveyslist = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', 'surveys'],
  description: 'Returns surveys that are accessible to the currently authenticated user.',
  notes: 'Returns surveys that are accessible to the currently authenticated user.',
  jsonp: 'callback',
  handler: function(request, reply) {
    try {
      var result = {
        "total": 1,
        "surveys": [{
          "id": 17461,
          "name": "First tour"
        }]
      };
      reply(result);
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.wrap(error, 400));
    }
  }
};