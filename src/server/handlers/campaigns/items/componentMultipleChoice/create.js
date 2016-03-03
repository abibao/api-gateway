"use strict";

var Joi = require("joi");
var Boom = require("boom");

module.exports = {
  auth: {
    strategy: "jwt",
    scope: ["administrator"]
  },
  tags: ["api", "1.3) administrator"],
  description: "Ajoute un composant MultipleChoice à un sondage donné",
  notes: "Ajoute un composant MultipleChoice à un sondage donné",
  payload: {
    allow: "application/x-www-form-urlencoded",
  },
  validate: {
    payload: {
      campaign: Joi.string().required(),
      question: Joi.string().required(),
      description: Joi.string(),
      required: Joi.boolean().default(false).required(),
      image: Joi.string().default("http://"),
      choices: Joi.string().required(),
      multipleSelections: Joi.boolean().required().default(false),
      randomize: Joi.boolean().required().default(false),
      addCustomOption: Joi.boolean().required().default(false),
      alignment: Joi.string().valid(["vertical","horizontal"]).required().default("horizontal"),
      label: Joi.string().required()
    }
  },
  jsonp: "callback",
  handler(request, reply) {
    request.payload.choices = request.payload.choices.split(",");
    request.server.domain.campaignItemMultipleChoiceCreateCommand(request.payload).then(function(campaignItem) {
      reply(campaignItem);
    })
    .catch(function(error) {
      request.server.logger.error(error);
      reply(Boom.badRequest(error));
    });
  }
};

