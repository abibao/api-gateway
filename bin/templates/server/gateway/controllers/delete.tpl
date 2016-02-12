"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.handler = {
  method: 'DELETE', 
  path: '{{&JS_HTTP_PATH}}/{id}',
  config: {
    auth: {
      strategy: 'jwt',
      scope: ['administrator']
    },
    tags: ['api', '1.4) administrator (Fcrud)'],
    description: 'Supprime un {{JS_MODEL_NAME}} à la base de donnée',
    notes: 'Supprime un {{JS_MODEL_NAME}} à la base de donnée',
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    jsonp: 'callback',
    handler: function(request, reply) {
      request.server.domain.{{JS_COMMAND_NAME}}(request.params.id).then(function(user) {
        reply(user);
      })
      .catch(function(error) {
        request.server.logger.error(error);
        reply(Boom.badRequest(error));
      });
    }
  }
};