"use strict";

var Joi = require('joi');
var Boom = require('boom');

exports.constants_delete = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Supprime une constante à un sondage donné',
  notes: 'Supprime une constante à un sondage donné',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      label: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.CampaignDeleteConstantCommand(request.payload).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.constants_update = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Modifie une constante à un sondage donné',
  notes: 'Modifie une constante à un sondage donné',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      label: Joi.string().required(),
      description: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.CampaignUpdateConstantCommand(request.payload).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.constants_create = {
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
      urn: Joi.string().required()
    },
    payload: {
      label: Joi.string().required(),
      description: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.CampaignCreateConstantCommand(request.payload).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.items_create = {
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
      urn: Joi.string().required()
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
    request.payload.campaign = request.params.urn;
    request.server.domain.CampaignItemCreateCommand(request.payload).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

/**
 * promise : done
 * tests : false
 **/
exports.list = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Retourne toutes les campagnes',
  notes: 'Retourne toutes les campagnes',
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.CampaignFilterQuery({}).then(function(campaigns) {
      reply(campaigns);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

/**
 * promise : done
 * tests : false
 **/
exports.read = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Retourne une campagne donnée',
  notes: 'Retourne une campagne donnée',
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.CampaignReadPopulateQuery(request.params.urn).then(function(campaign) {
      reply(campaign);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};