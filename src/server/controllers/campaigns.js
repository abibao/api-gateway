"use strict";

var Joi = require("joi");
var Boom = require("boom");

/**
 * promise : progress
 * tests : false
 **/
exports.itemsCreate = {
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
      label: Joi.string().required(),
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.payload.campaign = request.params.urn;
    request.server.domain.campaignItemCreateCommand(request.payload).then(function(campaign) {
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
exports.publish = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Publie une campagne pour un filtre d\"individus donné",
  notes: "Publie une campagne pour un filtre d\"individus donné",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    params: {
      urn: Joi.string().required(),
    },
    payload: {
      maximum: Joi.number().integer().min(0).required(),
      filter: Joi.string().required(),
      finishedAt: Joi.date().format("DD/MM/YYYY"),
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.campaignPublishCommand(request.payload).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};
