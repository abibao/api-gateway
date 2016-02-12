"use strict";

var Joi = require('joi');

module.exports.Schema = function(thinky) {
  var type = thinky.type;
  var r = thinky.r;
  var schema = {
    // fields
    email: type.string().email().required(),
    scope: type.string().default('individual'),
    verified: type.boolean().default(false),
    // linked
    // calculated
    hashedPassword: type.string(),
    salt: type.string(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  };
  
  return schema;
};

module.exports.JoiCreate = function() {
  var joi = {
    // fields
    email: Joi.string().email().required(),
    scope: Joi.string().valid(['individual', 'entity', 'charity']).default('individual'),
    verified: Joi.boolean().valid(true,false).default(false),
  };
  return joi;
};

module.exports.JoiUpdate = function() {
  var joi = {
    // fields
    email: Joi.string().email(),
    scope: Joi.string().valid(['individual', 'entity', 'charity']).default('individual'),
    verified: Joi.boolean().valid(true,false).default(false),
  };
  return joi;
};