"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.create = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute une entité au sein de Abibao',
  notes: 'Ajoute une entité au sein de Abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      name: Joi.string().required(),
      contact: Joi.string().email().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.CreateEntityCommand(request.payload).then(function(entity) {
      reply(entity);
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
  description: 'Retourne une entité donnée',
  notes: 'Retourne une entité donnée',
  validate: {
    params: {
      id: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.GetEntityQuery(request.params.id).then(function(entity) {
      reply(entity);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.list = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Retourne toutes les entités',
  notes: 'Retourne toutes les entités',
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.FindEntitiesQuery({}).then(function(entities) {
      reply(entities);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};