"use strict";

var Joi = require('joi');
var Boom = require('boom');
// var async = require('async');

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
    // testing password confirmation
    if (request.payload.password1!==request.payload.password2) return reply(Boom.badRequest('invalid password confimation'));
    // execute command
    request.server.domain.CreateIndividualCommand(request.payload, function(err) {
      if (err) {
        return reply(Boom.wrap(err, 400));
      }
      return reply(request.payload);
    });
    /*var count = 2;
    async.whilst(
      function () { return count < 25000; },
      function (callback) {
        count++;
        var u = {
          email:  count+'_'+request.payload.email,
          password: request.payload.password1
        };
        request.server.domain.CreateIndividualCommand(u, function(err) {
          callback(err);
        });
      },
      function (err) {
        return reply(request.payload);
      }
    );*/
  }

};

exports.count = {
  /*auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },*/
  auth: false,
  tags: ['api', 'individuals'],
  description: 'Récupérer le nombre total d\'utilisateurs de type "individual"',
  notes: 'Récupérer le nombre total d\'utilisateurs de type "individual"',
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

exports.readshort = {
  /*auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },*/
  auth: false,
  tags: ['api', 'individuals'],
  description: 'Récupérer la version courte d\'un utilisateur de type "individual"',
  notes: 'Récupérer la version courte d\'un utilisateur de type "individual"',
  validate: {
    params: {
      id: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    // execute command
    request.server.domain.ReadShortIndividualQuery(request.params.id, function(err, doc) {
      if (err) {
        request.server.logger.error(err);
        return reply(Boom.wrap(err, 400));
      }
      reply(doc);
    });
  }
};

exports.readshortlist = {
  /*auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },*/
  auth: false,
  tags: ['api', 'individuals'],
  description: 'Récupérer la version courte d\'une liste d\'utilisateurs de type "individual"',
  notes: 'Récupérer la version courte d\'une liste d\'utilisateurs de type "individual"',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      startIndex: Joi.number().integer().min(1).required(),
      nbIndexes: Joi.number().integer().min(1).required()
    }
  },
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

