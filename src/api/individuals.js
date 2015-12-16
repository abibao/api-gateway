"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var Bcrypt = require('bcrypt');

exports.login = {
  auth: false,
  tags: ['api', 'individuals'],
  description: 'Se connecter en tant qu\'individu sur abibao',
  notes: 'Se connecter en tant qu\'individu sur abibao',
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
    try {
      // execute command
      request.server.domain.FindShortIndividualByEmailQuery(request.payload.email, function(err, user) {
        if (err) {
          request.server.logger.error(err);
          return reply(Boom.wrap(err, 400)); 
        }
        var candidatePassword = request.payload.password;
        Bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
          if (err) return reply(Boom.wrap(err, 400));
          if (isMatch === false) return reply(Boom.unauthorized('invalid account'));
          user.scope = 'individual';
          delete user.password;
          var token = JWT.sign(user, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY || 'JWT_KEY');
          reply({token: token});
        });
      });
      /*var token = JWT.sign({}, 'plop');
      reply(token);*/
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.wrap(error, 400));
    }
  }
};

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
    // execute command
    request.payload.password = request.payload.password1;
    request.server.domain.CreateIndividualCommand(request.payload, function(err) {
      if (err) {
        return reply(Boom.wrap(err, 400));
      }
      return reply(request.payload);
    });
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
        return reply(Boom.wrap(err, 400));
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
    request.server.domain.ReadShortIndividualsListQuery(request.payload.startIndex, request.payload.nbIndexes, function(err, docs) {
      if (err) {
        request.server.logger.error(err);
        return reply(Boom.wrap(err, 400));
      }
      reply(docs);
    });
  }
};

