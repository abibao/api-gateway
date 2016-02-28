"use strict";

var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Retourne toutes les campagnes",
  notes: "Retourne toutes les campagnes",
  jsonp: "callback",
  handler: function(request, reply) {
    request.server.domain.campaignFilterQuery({}).then(function(campaigns) {
      reply(campaigns);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};