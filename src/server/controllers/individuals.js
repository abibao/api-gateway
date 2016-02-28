"use strict";

var Joi = require("joi");
var Boom = require("boom");
var MD5 = require("md5");

/**
 * promise : done
 * tests : false
 **/
exports.register = {
  auth: false,
  tags: ["api", "1.1) not authentified"],
  description: "Ajoute un individual sur abibao",
  notes: "Ajoute un individual sur abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    payload: {
      email: Joi.string().required().email(),
      password1: Joi.string().required(),
      password2: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.individualRegisterCommand(request.payload).then(function(individual) {
      reply(individual);
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
exports.login = {
  auth: false,
  tags: ["api", "1.1) not authentified"],
  description: "Authentifie un individu sur abibao",
  notes: "Authentifie un individu sur abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.individualLoginWithCredentialsCommand(request.payload)
    .then(function(credentials) {
      reply(credentials);
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
exports.campaignAssign = {
  auth: false,
  tags: ["api", "1.1) not authentified"],
  description: "Ajoute un sondage à un utilisateur donnée",
  notes: "Ajoute un sondage à un utilisateur donnée",
  validate: {
    params: {
      token: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.individualAssignCampaignCommand(request.params.token).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

