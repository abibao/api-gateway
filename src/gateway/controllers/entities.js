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
      type: Joi.string().valid(['charity', 'company']).required(),
      contact: Joi.string().email().required(),
      description: Joi.string()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.EntityCreateCommand(request.payload).then(function(entity) {
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
    request.server.domain.SystemReadDataQuery(request.server.domain.EntityModel, request.params.id).then(function(entity) {
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
    request.server.domain.SystemFindDataQuery(request.server.domain.EntityModel, {}).then(function(entities) {
      reply(entities);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.create_campaign = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute une campagne, affectée à une entité donnée',
  notes: 'Ajoute une campagne, affectée à une entité donnée',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      name: Joi.string().required(),
      company: Joi.string().required(),
      price: Joi.number().min(0).required(),
      currency: Joi.string().valid(['EUR']).required(),
      description: Joi.string()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.CampaignCreateCommand(request.payload).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.publish_campaign = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Publie une campagne pour un filtre de individuals donné',
  notes: 'Publie une campagne pour un filtre de individuals donné',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      campaign: Joi.string().required(),
      maximum: Joi.number().integer().min(0).required(),
      filter: Joi.string().required(),
      finishedAt: Joi.date().format('DD/MM/YYYY'),
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.payload.entity = request.params.id;
    request.server.domain.CampaignPublishCommand(request.payload).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.list_campaigns = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Retourne la liste des campagnes d\'une entité donnée',
  notes: 'Retourne la liste des campagnes d\'une entité donnée',
  validate: {
    params: {
      id: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.EntityListCampaignsQuery(request.params.id).then(function(campaigns) {
      reply(campaigns);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};