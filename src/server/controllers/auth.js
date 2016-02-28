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

exports.surveysRead = {
  auth: {
    strategy: "jwt",
    scope: ["individual"]
  },
  tags: ["api", "1.2) individual"],
  description: "Retourne les données d\"un sondage", 
  notes: "Retourne les données d\"un sondage",
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.surveyReadPopulateControlIndividualQuery(request.auth.credentials, request.params).then(function(survey) {
      reply(survey);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};
