"use strict";

var Joi = require('joi');
var Boom = require('boom');
var MD5 = require('md5');

/**
 * promise : done
 * tests : false
 **/
exports.register = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Ajoute un individual sur abibao',
  notes: 'Ajoute un individual sur abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      email: Joi.string().required().email(),
      password1: Joi.string().required(),
      password2: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualRegisterCommand(request.payload).then(function(individual) {
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
  tags: ['api', '1.1) not authentified'],
  description: 'Authentifie un individu sur abibao',
  notes: 'Authentifie un individu sur abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualLoginWithCredentialsCommand(request.payload)
    .then(function(credentials) {
      reply(credentials);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.campaigns_assign = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Ajoute un sondage à un utilisateur donnée',
  notes: 'Ajoute un sondage à un utilisateur donnée',
  validate: {
    params: {
      token: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualAssignCampaignCommand(request.params.token).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.count = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Récupère le nombre total d\'utilisateurs de type "individual"',
  notes: 'Récupère le nombre total d\'utilisateurs de type "individual"',
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualsCountQuery().then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

/**exports.verify_email = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Valide le compte d\'un utilisateur',
  notes: 'Valide le compte d\'un utilisateur',
  validate: {
    params: {
      token: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualVerifyEmailCommand(request.params.token).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};**/

