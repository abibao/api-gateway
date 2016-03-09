"use strict";

var _ = require("lodash");
var nconf = require("nconf");
nconf.argv().env();

var Cryptr = require("cryptr"),
cryptr = new Cryptr(nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"));

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var CampaignConstantModel = thinky.createModel("campaigns_constants", {
    // virtuals
    urn: type.virtual().default(function() {
      return _.isUndefined(this.id)  ? null : "urn:abibao:database:campaign:constants:"+cryptr.encrypt(this.id);
    }),
    name: type.virtual().default(function() {
      return this.prefix + "__" + this.suffix;
    }),
    // fields
    prefix: type.string().required(),
    suffix: type.string().required(),
    fr: type.string().required(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  CampaignConstantModel.pre("save", function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return CampaignConstantModel;
  
};