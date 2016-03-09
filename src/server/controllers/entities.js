"use strict";

var Joi = require("joi");
var Boom = require("boom");

exports.campaigns_list = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Retourne la liste des campagnes d\"une entité donnée",
  notes: "Retourne la liste des campagnes d\"une entité donnée",
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.server.domain.entityListCampaignsQuery(request.params.urn).then(function(campaigns) {
      reply(campaigns);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};