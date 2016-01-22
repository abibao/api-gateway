"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var MD5 = require('md5');

exports.register = {
  auth: false,
  tags: ['noauth'],
  description: 'S\'enregistrer en tant qu\'administrateur sur abibao',
  notes: 'S\'enregistrer en tant qu\'administrateur sur abibao',
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
    request.server.domain.CreateAdministratorCommand(request.payload).then(function(user) {
      reply(user);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  
  }
};