"use strict";

var Joi = require("joi");
var Boom = require("boom");

/**
 * promise : done
 * tests : false
 **/
exports.create = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Ajoute une entité au sein de Abibao",
  notes: "Ajoute une entité au sein de Abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    payload: {
      name: Joi.string().required(),
      type: Joi.string().valid(["charity", "company"]).required(),
      contact: Joi.string().email().required(),
      description: Joi.string()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.entityCreateCommand(request.payload).then(function(entity) {
      reply(entity);
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
exports.update = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Modifie une entité au sein de Abibao",
  notes: "Modifie une entité au sein de Abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      name: Joi.string(),
      type: Joi.string().valid(["charity", "company"]),
      contact: Joi.string().email(),
      description: Joi.string(),
      picture: Joi.string(),
      avatar: Joi.string(),
      icon: Joi.string()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.entityUpdateCommand(request.payload).then(function(entity) {
      reply(entity);
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
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Retourne une entité donnée",
  notes: "Retourne une entité donnée",
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.entityReadQuery(request.params.urn).then(function(entity) {
      reply(entity);
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
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Retourne toutes les entités",
  notes: "Retourne toutes les entités",
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.entityFilterQuery({}).then(function(entities) {
      reply(entities);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.campaigns_list = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Retourne la liste des campagnes d\"une entité donnée",
  notes: "Retourne la liste des campagnes d\"une entité donnée",
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.entityListCampaignsQuery(request.params.urn).then(function(campaigns) {
      reply(campaigns);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};