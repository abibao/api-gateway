"use strict";

var Boom = require('boom');
var Joi = require('joi');
var jwt = require('jsonwebtoken');

exports.login_administrator = {
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
    request.server.domain.FindAdministratorsQuery({email:request.payload.email}).then(function(users) {
      if (users.length===0) return reply(Boom.badRequest('User not found'));
      if (users.length>1) return reply(Boom.badRequest('Too many emails, contact an administrator'));
      var user = users[0];
      if (user.authenticate(request.payload.password)) {
        var signToken = jwt.sign({ id: user.id, scope: user.scope }, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, { expiresIn: 60*60*24 });
  		  reply({token: signToken});
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

exports.login_individual = {
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
    request.server.domain.FindDataQuery(request.server.domain.IndividualModel, {email:request.payload.email}).then(function(users) {
      if (users.length===0) return reply(Boom.badRequest('User not found'));
      if (users.length>1) return reply(Boom.badRequest('Too many emails, contact an administrator'));
      var user = users[0];
      if (user.authenticate(request.payload.password)) {
        var signToken = jwt.sign({ id: user.id, scope: user.scope }, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, { expiresIn: 60*60*24 });
  		  reply({token: signToken});
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