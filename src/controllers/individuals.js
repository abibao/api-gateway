"use strict";

var Joi = require('joi');
var Boom = require('boom');

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
    try {
      reply(request.payload);
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.wrap(error, 400));
    }
  }
};

exports.list = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
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
    try {
      // testing password confirmation
      if (request.payload.password1!==request.payload.password2) return reply(Boom.badRequest('invalid password confimation'));
      request.payload.password = request.payload.password1;
      // execute command
      request.server.domain.createIndividual(request.payload, function(err) {
        if (err) throw new Error(err);
        reply(request.payload);
      });
    } catch (e) {
      var error = new Error(e);
      request.server.logger.error(error);
      return reply(Boom.wrap(error, 400));
    }
  }

};