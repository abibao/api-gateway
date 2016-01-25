"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.create = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute un sondage, affectée à une entité donnée',
  notes: 'Ajoute un sondage, affectée à une entité donnée',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      name: Joi.string().required(),
      description: Joi.string(),
      entity: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.CreateSurveyCommand(request.payload).then(function(survey) {
      reply(survey);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.crup_constant = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute une constante à un sondage donné',
  notes: 'Ajoute une constante à un sondage donné',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    payload: {
      label: Joi.string().required(),
      description: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.payload.id = request.params.id;
    request.server.domain.CreateSurveyConstantCommand(request.payload).then(function(survey) {
      reply(survey);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.create_item = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute une question à un sondage donné',
  notes: 'Ajoute une question à un sondage donné',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    payload: {
      optional: Joi.boolean().required().default(false),
      title: Joi.string().required(),
      description: Joi.string(),
      component: Joi.string().required(),
      label: Joi.string().required(),
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.payload.survey = request.params.id;
    request.server.domain.CreateSurveyItemCommand(request.payload).then(function(survey) {
      reply(survey);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.read = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Retourne un sondage donné',
  notes: 'Retourne un sondage donné',
  validate: {
    params: {
      id: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.GetSurveyPopulateQuery(request.params.id).then(function(survey) {
      reply(survey);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};