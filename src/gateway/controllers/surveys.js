"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.read = {
  auth: false,
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
    request.server.domain.SurveyReadPopulateQuery(request.params.id).then(function(survey) {
      reply(survey);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};