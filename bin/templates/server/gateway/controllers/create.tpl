"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.handler = {
  method: 'POST', 
  path: '{{&JS_HTTP_PATH}}',
  config: {
    auth: {
      strategy: 'jwt',
      scope: ['administrator']
    },
    tags: ['api', '1.4) administrator (Fcrud)'],
    description: 'Ajoute un {{JS_MODEL_NAME}} à la base de donnée',
    notes: 'Ajoute un {{JS_MODEL_NAME}} à la base de donnée',
    payload: {
      allow: 'application/x-www-form-urlencoded',
    },
    validate: {
      payload: {{&JS_VALIDATE_PAYLOAD}}
    },
    jsonp: 'callback',
    handler: function(request, reply) {
      request.server.domain.{{JS_COMMAND_NAME}}(request.payload).then(function(model) {
        reply(model);
      })
      .catch(function(error) {
        request.server.logger.error(error);
        reply(Boom.badRequest(error));
      });
    }
  }
};