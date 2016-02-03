"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var MD5 = require('md5');

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
    // password confirmation
    if (request.payload.password1!==request.payload.password2) return reply(Boom.badRequest('invalid password confimation'));
    request.payload.password = request.payload.password1;
    delete request.payload.password1;
    delete request.payload.password2;
    // execute command
    request.server.domain.AdministratorCreateCommand(request.payload).then(function(user) {
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
    request.server.domain.SystemFindDataQuery(request.server.domain.AdministratorModel, {email:request.payload.email}).then(function(users) {
      if (users.length===0) return reply(Boom.badRequest('User not found'));
      if (users.length>1) return reply(Boom.badRequest('Too many emails, contact an administrator'));
      var user = users[0];
      if (user.authenticate(request.payload.password)) {
        // all done then reply token
        request.server.domain.AdministratorCreateAuthTokenCommand(user).then(function(token) {
          reply({token:token});
        })
        .catch(function(error) {
          request.server.logger.error(error);
          reply(Boom.badRequest(error));
        });
      } else {
        reply(Boom.unauthorized('User not authenticate'));
      }
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};