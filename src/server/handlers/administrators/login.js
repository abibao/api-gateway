"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: false,
  tags: ["api", "1.1) not authentified"],
  description: "Authentifie un administrateur sur abibao",
  notes: "Authentifie un administrateur sur abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.server.domain.administratorLoginWithCredentialsCommand(request.payload)
    .then(function(credentials) {
      reply(credentials);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};