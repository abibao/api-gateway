"use strict";

var Joi = require('joi');
var Boom = require('boom');
var JWT = require('jsonwebtoken');
var MD5 = require('md5');

exports.me = {
  auth: 'jwt',
  tags: ['api', '1.2) individual', '1.3) administrator'],
  description: 'Retourne l\'utilisateur actuellement connecté',
  notes: 'Retourne l\'utilisateur actuellement connecté', 
  jsonp: 'callback',
  handler: function(request, reply) {
    var authenticated_user = request.auth.credentials;
    delete authenticated_user.iat;
    delete authenticated_user.exp;
    reply(authenticated_user);
  }
};

exports.list_surveys = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Récupère la liste des sondages de l\'utilisateur actuellement connecté',
  notes: 'Récupère la liste des sondages de l\'utilisateur actuellement connecté',
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