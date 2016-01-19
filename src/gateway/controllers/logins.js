"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var Bcrypt = require('bcrypt');
var MD5 = require('md5');

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
      // prepare 
      var email = request.payload.email;
      var params = {
        id: MD5(email),
        email: email
      };
      // execute command
      request.server.domain.FindShortAdministratorsQuery(params, function(err, users) {
        if (err) {
          request.server.logger.error(err);
          return reply(Boom.badRequest(err));
        }
        var user = users[0];
        var candidatePassword = request.payload.password;
        Bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
          if (err) return reply(Boom.badRequest(err));
          if (isMatch === false) return reply(Boom.unauthorized('invalid account'));
          user.scope = 'administrator';
          delete user.password;
          delete user.salt;
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
      // prepare 
      var email = request.payload.email;
      var params = {
        id: MD5(email),
        email: email
      };
      // execute command
      request.server.domain.FindShortIndividualsQuery(params, function(err, users) {
        if (err) {
          request.server.logger.error(err);
          return reply(Boom.badRequest(err));
        }
        var user = users[0];
        var candidatePassword = request.payload.password;
        Bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
          if (err) return reply(Boom.badRequest(err));
          if (isMatch===false) return reply(Boom.unauthorized('invalid account'));
          // email not verified
          if (user.verified===false) {
            request.server.logger.error('Email not verified.');
            return reply(Boom.badRequest(new Error('Email not verified.')));
          }
          user.scope = 'individual';
          delete user.password;
          delete user.salt;
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