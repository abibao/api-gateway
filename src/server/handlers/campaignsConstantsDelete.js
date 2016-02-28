"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Supprime une constante à un sondage donné",
  notes: "Supprime une constante à un sondage donné",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      label: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.campaignConstantDeleteCommand(request.payload).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};