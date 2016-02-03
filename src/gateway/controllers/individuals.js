"use strict";

var Joi = require('joi');
var Boom = require('boom');
var MD5 = require('md5');

exports.register = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Ajoute un individu sur abibao',
  notes: 'Ajoute un individu sur abibao',
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
    request.server.domain.IndividualCreateCommand(request.payload).then(function(user) {
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
    request.server.domain.SystemFindDataQuery(request.server.domain.IndividualModel, {email:request.payload.email}).then(function(users) {
      if (users.length===0) return reply(Boom.badRequest('User not found'));
      if (users.length>1) return reply(Boom.badRequest('Too many emails, contact an administrator'));
      var user = users[0];
      if (user.authenticate(request.payload.password)) {
        // all done then reply token
        request.server.domain.IndividualCreateAuthTokenCommand(user).then(function(token) {
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

exports.verify_email = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Valide le compte d\'un utilisateur',
  notes: 'Valide le compte d\'un utilisateur',
  validate: {
    params: {
      token: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualVerifyEmailCommand(request.params.token).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.assign_campaign = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Ajoute un sondage à un utilisateur donnée',
  notes: 'Ajoute un sondage à un utilisateur donnée',
  validate: {
    params: {
      token: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualAssignCampaignCommand(request.params.token).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.survey_answer = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Répond à une question d\'un sondage donné',
  notes: 'Répond à une question d\'un sondage donné',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    payload: {
      label: Joi.string().required(),
      answer: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler: function(request, reply) {
    request.payload.survey = request.params.id;
    request.server.domain.IndividualSurveyAnswerCommand(request.auth.credentials, request.payload).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

exports.count = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Récupère le nombre total d\'utilisateurs de type "individual"',
  notes: 'Récupère le nombre total d\'utilisateurs de type "individual"',
  jsonp: 'callback',
  handler: function(request, reply) {
    request.server.domain.IndividualsCountQuery().then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

