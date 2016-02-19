"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var MD5 = require('md5');

/**
 * promise : done
 * tests : false
 **/
exports.register = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute un administrateur sur abibao',
  notes: 'Ajoute un administrateur sur abibao',
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
    request.server.domain.AdministratorRegisterCommand(request.payload).then(function(user) {
      reply(user);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  
  }
};

exports.login = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Authentifie un administrateur sur abibao',
  notes: 'Authentifie un administrateur sur abibao',
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
    request.server.domain.AdministratorLoginWithCredentialsCommand(request.payload)
    .then(function(credentials) {
      reply(credentials);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};