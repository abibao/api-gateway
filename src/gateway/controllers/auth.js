"use strict";

var Boom = require('boom');
var Joi = require('joi');

exports.surveys_answers = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Répond à une question d\'un sondage donné',
  notes: 'Répond à une question d\'un sondage donné',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    payload: {
      label: Joi.string().required(),
      answer: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.payload.survey = request.params.id;
    request.server.domain.IndividualSurveyAnswerCommand(request.auth.credentials, request.payload).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.surveys_read = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Retourne les données d\'un sondage', 
  notes: 'Retourne les données d\'un sondage',
  validate: {
    params: {
      id: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.SurveyReadPopulateControlIndividualQuery(request.auth.credentials, request.params).then(function(survey) {
      reply(survey);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.global_informations = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Retourne des informations rapides sur l\'utilisateur actuellement connecté', 
  notes: 'Retourne des informations rapides sur l\'utilisateur actuellement connecté', 
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.AuthentificationGlobalInformationsQuery(request.auth.credentials).then(function(user) {
      reply(user);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.resend_verification_email = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Renvoie un email de validation de compte',
  notes: 'Renvoie un email de validation de compte',
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualSendAgainEmailVerificationCommand(request.auth.credentials).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};