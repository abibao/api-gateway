"use strict";

var Boom = require("boom");
var Joi = require("joi");

/**
 * promise : progress
 * tests : false
 **/
exports.surveysAnswers = {
  auth: {
    strategy: "jwt",
    scope: ["individual"]
  },
  tags: ["api", "1.2) individual"],
  description: "Répond à une question d\"un sondage donné",
  notes: "Répond à une question d\"un sondage donné",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      label: Joi.string().required(),
      answer: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.payload.survey = request.params.urn;
    request.server.domain.individualSurveyAnswerCommand(request.auth.credentials, request.payload).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};
