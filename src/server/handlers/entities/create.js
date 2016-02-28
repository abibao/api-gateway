"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Ajoute une entité au sein de Abibao",
  notes: "Ajoute une entité au sein de Abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    payload: {
      name: Joi.string().required(),
      type: Joi.string().valid(["charity", "company"]).required(),
      contact: Joi.string().email().required(),
      description: Joi.string()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.server.domain.entityCreateCommand(request.payload).then(function(entity) {
      reply(entity);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};