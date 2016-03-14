"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Modifie une entité au sein de Abibao",
  notes: "Modifie une entité au sein de Abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      name: Joi.string(),
      type: Joi.string().valid(["abibao", "charity", "company"]),
      contact: Joi.string().email(),
      description: Joi.string(),
      picture: Joi.string(),
      avatar: Joi.string(),
      icon: Joi.string()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.entityUpdateCommand(request.payload).then(function(entity) {
      reply(entity);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};