"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Retourne un choix donné",
  notes: "Retourne un choix donné",
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.server.domain.campaignItemChoiceReadQuery(request.params.urn).then(function(choice) {
      reply(choice);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};