"use strict";

var Boom = require('boom');

exports.global_informations = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Retourne des informations rapides sur l\'utilisateur actuellement connecté', 
  notes: 'Retourne des informations rapides sur l\'utilisateur actuellement connecté', 
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.AuthentificationGlobalInformationsQuery(request.auth.credentials).then(function(user) {
      reply(user);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.resend_verification_email = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Renvoie un email de validation de compte',
  notes: 'Renvoie un email de validation de compte',
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualSendAgainEmailVerificationCommand(request.auth.credentials).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};