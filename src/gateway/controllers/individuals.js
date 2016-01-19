"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var MD5 = require('md5');

exports.register = {
  auth: false,
  tags: ['api', 'individuals'],
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
    // testing password confirmation
    if (request.payload.password1!==request.payload.password2) return reply(Boom.badRequest('invalid password confimation'));
    // execute command : create individual
    request.payload.password = request.payload.password1;
    request.payload.verified = false;
    request.server.domain.CreateIndividualCommand(request.payload, function(err, user) {
      if (err) {
        request.server.logger.error(err);
        return reply(Boom.badRequest(err));
      }
      // execute command : send email
      request.server.domain.SendIndividualEmailVerificationCommand(user.email, function(err) {
        if (err) {
          request.server.logger.error(err);
          return reply(Boom.badRequest(err));
        }
        reply({registered:true});
      });
    });
  }
};

exports.update = {
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
};

exports.verifyEmail = {
  auth: false,
  tags: ['api', 'individuals'],
  description: 'Valider le compte d\'un utilisateur de type "individual"',
  notes: 'Valider le compte d\'un utilisateur de type "individual"',
  validate: {
    params: {
      token: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    try {
      var email = JWT.verify(request.params.token, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);
      var id = MD5(email);
      request.server.domain.ReadShortIndividualQuery(id, function(err, user) {
        if (err) {
          request.server.logger.error(err);
          return reply(Boom.badRequest(err));
        }
        // already verified
        if (user.verified===true) {
          request.server.logger.error('Email already verified.');
          return reply(Boom.badRequest(new Error('Email already verified.')));
        }
        user.verified = true;
        request.server.domain.UpdateIndividualCommand(user, function(err, user) {
          if (err) {
            request.server.logger.error(err);
            return reply(Boom.badRequest(err));
          }
          reply({verified:true});
        });
      });
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.badRequest(error));
    }
  }
};

exports.resendVerificationEmail = {
  auth: false,
  tags: ['api', 'individuals'],
  description: 'Renvoyer un email de validation de compte utilisateur de type "individual"',
  notes: 'Renvoyer un email de validation de compte utilisateur de type "individual"',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      email: Joi.string().required().email()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    try {
      // execute command : find user or not in database ?
      var email = request.payload.email;
      var id = MD5(email);
      request.server.domain.ReadShortIndividualQuery(id, function(err, user) {
        if (err) {
          request.server.logger.error(err);
          return reply(Boom.badRequest(err));
        }
        // already verified
        if (user.verified===true) {
          request.server.logger.error('Email already verified.');
          return reply(Boom.badRequest(new Error('Email already verified.')));
        }
        // execute command : send email
        request.server.domain.SendIndividualEmailVerificationCommand(user.email, function(err) {
          if (err) {
            request.server.logger.error(err);
            return reply(Boom.badRequest(err));
          }
          reply({sent:true});
        });
      });
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.badRequest(error));
    }
  }
};

exports.count = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', 'individuals'],
  description: 'Récupérer le nombre total d\'utilisateurs de type "individual"',
  notes: 'Récupérer le nombre total d\'utilisateurs de type "individual"',
  jsonp: 'callback',
  handler: function(request, reply) {
    // execute command
    request.server.domain.CountIndividualsQuery(function(err, result) {
      if (err) {
        request.server.logger.error(err);
        return reply(Boom.badRequest(err));
      }
      reply(result);
    });
  }
};

exports.readshortlist = {
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
    // execute command
    request.server.domain.ReadShortIndividualsListQuery(request.params.startIndex, request.params.nbIndexes, function(err, docs) {
      if (err) {
        request.server.logger.error(err);
        return reply(Boom.badRequest(err));
      }
      reply(docs);
    });
  }
};

