"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Modifie une entité au sein de Abibao",
  notes: "Modifie une entité au sein de Abibao",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      name: Joi.string().description("Le titre qui apparaît dans les listes"),
      type: Joi.string().valid(["abibao", "charity", "company"]).default("charity").description("Type de l'entité"),
      contact: Joi.string().email().description("Email du contact"),
      url: Joi.string().description("URL du site de l'entité"),
      title: Joi.string().description("Le titre qui apparaît sur la fiche détaillée"),
      hangs: Joi.string().description("La phrase qui décrit la fiche détaillée"),
      description: Joi.string().description("La description (300 caractères)"),
      usages: Joi.string().description("Exemples concrêts de l'usage des dons.")
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.payload.urn = request.params.urn;
    request.server.domain.entityUpdateCommand(request.payload).then(function(entity) {
      reply(entity);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};