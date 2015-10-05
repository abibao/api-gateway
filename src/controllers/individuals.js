'use-strict';

var http_request = require('request');

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');

// service discovery localhost or tutum
var MICROSERVICE_USER_INDIVIDUAL_HOSTNAME = process.env.ABIBAO_TUTUM_MICROSERVICE_USER_INDIVIDUAL_HOSTNAME || 'http://localhost';
var MICROSERVICE_USER_INDIVIDUAL_PORT = process.env.ABIBAO_TUTUM_MICROSERVICE_USER_INDIVIDUAL_PORT || '27501';
var MICROSERVICE_USER_INDIVIDUAL_SERVICE = MICROSERVICE_USER_INDIVIDUAL_HOSTNAME+':'+MICROSERVICE_USER_INDIVIDUAL_PORT;

exports.alive = {
  auth: false,
  tags: ['api', 'individuals'],
  description: 'Tester si le microservice user-individuals est en vie ou pas.',
  notes: 'Tester si le microservice user-individuals est en vie ou pas.',
  handler: function(request, reply) {
    http_request
    .get( MICROSERVICE_USER_INDIVIDUAL_SERVICE+'/alive', function(error, response, body) {
      if (error && error.code=='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

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
    http_request
    .post(MICROSERVICE_USER_INDIVIDUAL_SERVICE+'/login', { form: request.payload }, function(error, response, body) {
      if (error && error.code=='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
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
    http_request
    .post(MICROSERVICE_USER_INDIVIDUAL_SERVICE+'/list', { form: request.payload }, function(error, response, body) {
      if (error && error.code=='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

/**
exports.register = {
  auth: false,
  validate: {
    payload: {
      email: Joi.string().email(),
      password1: Joi.string().required(),
      password2: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    // password == passwordConfirm
    if (request.payload.password1!=request.payload.password2) return reply(Boom.badRequest('invalid password confimation'));
    request.payload.password = request.payload.password1;
    // save user
    var user = new User(request.payload);
    user.save(request.payload, function(err, individual) {
      console.log(err, individual);
      if (err) {
        if (err.code==11000 || err.code==11001) return reply(Boom.forbidden('user already exists'));
        reply(Boom.badImplementation(err)); // 500 error
      }
      reply(individual);
    });
  }
};
**/