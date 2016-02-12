"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.handler = {
  method: 'PATCH', 
  path: '{{&JS_HTTP_PATH}}/{id}',
  config: {
    auth: {
      strategy: 'jwt',
      scope: ['administrator']
    },
    tags: ['api', '1.4) administrator (Fcrud)'],
    description: 'Modifie un {{JS_MODEL_NAME}} à la base de donnée',
    notes: 'Modifie un {{JS_MODEL_NAME}} à la base de donnée',
    payload: {
      allow: 'application/x-www-form-urlencoded',
    },
    validate: {
      params: {
        id: Joi.string().required()
      },
      payload: {{JS_VALIDATE_PAYLOAD}}
    },
    jsonp: 'callback',
    handler: function(request, reply) {
      request.payload.id = request.params.id;
      request.server.domain.{{JS_COMMAND_NAME}}(request.payload).then(function(user) {
        reply(user);
      })
      .catch(function(error) {
        request.server.logger.error(error);
        reply(Boom.badRequest(error));
      });
    }
  }
};