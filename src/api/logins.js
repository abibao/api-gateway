"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var Bcrypt = require('bcrypt');

exports.login_administrator = {
  auth: false,
  tags: ['api', 'administrators'],
  description: 'Se connecter en tant qu\'administrateur sur abibao',
  notes: 'Se connecter en tant qu\'administrateur sur abibao',
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
      request.server.domain.FindShortAdministratorByEmailQuery(request.payload.email, function(err, user) {
        if (err) {
          request.server.logger.error(err);
          return reply(Boom.badRequest(err));
        }
        var candidatePassword = request.payload.password;
        Bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
          if (err) return reply(Boom.badRequest(err));
          if (isMatch === false) return reply(Boom.unauthorized('invalid account'));
          user.scope = 'administrator';
          delete user.password;
          var token = JWT.sign(user, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);
          reply({token: token});
        });
      });
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.badRequest(error));
    }
  }
};

exports.login_individual = {
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
          return reply(Boom.badRequest(err));
        }
        var candidatePassword = request.payload.password;
        Bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
          if (err) return reply(Boom.badRequest(err));
          if (isMatch === false) return reply(Boom.unauthorized('invalid account'));
          user.scope = 'individual';
          delete user.password;
          var token = JWT.sign(user, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);
          reply({token: token});
        });
      });
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.badRequest(error));
    }
  }
};