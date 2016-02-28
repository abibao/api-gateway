"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Ajoute une question à un sondage donné",
  notes: "Ajoute une question à un sondage donné",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      optional: Joi.boolean().required().default(false),
      title: Joi.string().required(),
      description: Joi.string(),
      component: Joi.string().required(),
      answerValue: Joi.string().required(),
      answerFormat: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.payload.campaign = request.params.urn;
    request.payload.component = JSON.parse(request.payload.component);
    request.payload.answer = {
      format: request.payload.answerFormat,
      value:  request.payload.answerValue
    };
    request.server.domain.campaignItemCreateCommand(request.payload).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

