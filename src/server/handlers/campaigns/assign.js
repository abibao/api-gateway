"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: false,
  tags: ["api", "1.1) not authentified"],
  description: "Ajoute un sondage à un utilisateur donnée",
  notes: "Ajoute un sondage à un utilisateur donnée",
  validate: {
    params: {
      token: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.server.domain.individualAssignCampaignCommand(request.params.token).then(function(result) {
      reply(result);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

