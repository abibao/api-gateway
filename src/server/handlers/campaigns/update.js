"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Modifie une campagne au sein de Abibao",
  notes:  "Modifie une campagne au sein de Abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      name: Joi.string(),
      abibao: Joi.string().min(0).default(0),
      price: Joi.number().min(0),
      currency: Joi.string().valid(["EUR"]),
      published: Joi.boolean().default(false),
      description: Joi.string()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.campaignUpdateCommand(request.payload).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};