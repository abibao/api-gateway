"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var MD5 = require('md5');

exports.register = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'S\'enregistrer en tant qu\'individu sur abibao',
  notes: 'S\'enregistrer en tant qu\'individu sur abibao',
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
    // password confirmation
    if (request.payload.password1!==request.payload.password2) return reply(Boom.badRequest('invalid password confimation'));
    request.payload.password = request.payload.password1;
    delete request.payload.password1;
    delete request.payload.password2;
    // execute command
    request.server.domain.CreateIndividualCommand(request.payload).then(function(user) {
      reply(user);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  
  }
};

exports.verify_email = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Valider le compte d\'un utilisateur de type "individual"',
  notes: 'Valider le compte d\'un utilisateur de type "individual"',
  validate: {
    params: {
      token: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    var email = JWT.verify(request.params.token, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, function(err, decoded) {
      if (err) {
        request.server.logger.error(err);
        return reply(Boom.badRequest(err));
      }
      request.server.domain.VerifyIndividualEmailCommand(email).then(function(result) {
        reply(result);
      })
      .catch(function(error) {
        request.server.logger.error(error);
        reply(Boom.badRequest(error));
      });
    });
  }
};

exports.resend_verification_email = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Renvoyer un email de validation de compte de type "individual"',
  notes: 'Renvoyer un email de validation de compte utilisateur de type "individual"',
  jsonp: 'callback',
  handler: function(request, reply) {
    var authenticated_user = request.auth.credentials;
    request.server.domain.SendAgainIndividualEmailVerificationCommand(authenticated_user.id).then(function(result) {
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
  description: 'Récupérer le nombre total d\'utilisateurs de type "individual"',
  notes: 'Récupérer le nombre total d\'utilisateurs de type "individual"',
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.CountIndividualsQuery().then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

/*exports.read_short_list = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', 'individuals'],
  description: 'Récupérer la version courte d\'une liste d\'utilisateurs de type "individual"',
  notes: 'Récupérer la version courte d\'une liste d\'utilisateurs de type "individual"',
  validate: {
    params: {
      startIndex: Joi.number().integer().min(1).required(),
      nbIndexes: Joi.number().integer().min(1).required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.ReadShortIndividualsListQuery(request.params.startIndex, request.params.nbIndexes, function(err, docs) {
      if (err) {
        request.server.logger.error(err);
        return reply(Boom.badRequest(err));
      }
      reply(docs);
    });
  }
};*/

/*exports.update = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', 'individuals'],
  description: 'Mise à jour d\'un individu sur abibao',
  notes: 'Mise à jour d\'un individu sur abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    payload: {
      birthday: Joi.date(),
      sex: Joi.number().integer().min(0).max(1)
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    reply({update:true});
  }
};*/

