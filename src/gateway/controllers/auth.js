"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var MD5 = require('md5');

exports.me = {
  auth: 'jwt',
  tags: ['api', 'auth'],
  description: 'Returns currently authenticated user.',
  notes: 'Returns currently authenticated user.',
  jsonp: 'callback',
  handler: function(request, reply) {
    var authenticated_user = request.auth.credentials;
    reply(authenticated_user);
  }
};

exports.me_update = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', 'auth'],
  description: 'Update currently authenticated user.',
  notes: 'Update currently authenticated user.',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      birthday: Joi.date(),
      sex: Joi.number().integer().min(0).max(1)
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    var authenticated_user = request.auth.credentials;
    reply({user:authenticated_user,update:true});
  }
};

exports.surveyslist = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', 'auth'],
  description: 'Returns surveys that are accessible to the currently authenticated user.',
  notes: 'Returns surveys that are accessible to the currently authenticated user.',
  jsonp: 'callback',
  handler: function(request, reply) {
    try {
      var result = {
        "total": 2,
        "surveys": [{
          "id": 17461,
          "name": "First tour"
        },{
          "id": 18421,
          "name": "second tour"
        }]
      };
      reply(result);
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.badRequest(error));
    }
  }
};