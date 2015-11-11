"use strict";

var Joi = require('joi');
var Boom = require('boom');
//var Individual = require('../models/individual');

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
  handler: function(request, reply) {
    reply(request.payload);
  }
};

exports.list = {
  /*auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },*/
  auth: false,
  tags: ['api', 'individuals'],
  description: 'Récupérer la liste de tous les utilisateurs de type "individual"',
  notes: 'Récupérer la liste de tous les utilisateurs de type "individual"',
  handler: function(request, reply) {
    var r = request.server.plugins['hapi-rethinkdb'].rethinkdb;
    var connection = request.server.plugins['hapi-rethinkdb'].connection;
    r.table('individuals').run(connection, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
        reply(Boom.badImplementation(err)); // 500 error
        return reply(JSON.stringify(result, null, 2));
        });
    });
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
  handler: function(request, reply) {
    
    // password == passwordConfirm
    if (request.payload.password1!==request.payload.password2) return reply(Boom.badRequest('invalid password confimation'));
    request.payload.password = request.payload.password1;
    
    request.server.logger_slack.info('individualCreated', request.payload.email);
    reply(request.payload);
    
  }
    /**
    var r = request.server.plugins['hapi-rethinkdb'].rethinkdb;
    var connection = request.server.plugins['hapi-rethinkdb'].connection;

    // password == passwordConfirm
    if (request.payload.password1!==request.payload.password2) return reply(Boom.badRequest('invalid password confimation'));
    request.payload.password = request.payload.password1;
    
    r.table('individuals').insert({email: request.payload.email}).run(connection, function(err, result) {
      reply(Boom.badImplementation(err)); // 500 error
      return reply(JSON.stringify(result, null, 2));
    });**/

};