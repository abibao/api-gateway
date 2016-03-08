"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Ajoute une constante pour les campagnes",
  notes: "Ajoute une constante pour les campagnes",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    payload: {
      prefix: Joi.string().required(),
      suffix: Joi.string().required(),
      fr: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.server.domain.campaignConstantCreateCommand(request.payload).then(function(constant) {
      reply(constant);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};