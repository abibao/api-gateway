"use strict";

var _ = require("lodash");
var nconf = require("nconf");
nconf.argv().env().file({ file: 'nconf-env.json' });

var Cryptr = require("cryptr"),
cryptr = new Cryptr(nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"));

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;

  var EntityModel = thinky.createModel("entities", {
    // virtuals
    urn: type.virtual().default(function() {
      return _.isUndefined(this.id)  ? null : "urn:abibao:database:entity:"+cryptr.encrypt(this.id);
    }),
    // fields
    name: type.string().required(),
    contact: type.string().email().required(),
    url: type.string().default("").required(),
    type: type.string().enum(["none", "abibao", "charity", "company"]).required(),
    icon: type.string().default("images/icons/default.png"),
    avatar: type.string().default("images/avatars/default.png"),
    picture: type.string().default("images/pictures/default.png"),
    title: type.string().required(),
    hangs: type.string().required(),
    description: type.string().required(),
    usages: type.string().required(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  // var CampaignModel = thinky.models['campaigns'];
  // EntityModel.hasMany(CampaignModel, "campaigns", "id", "company");
  
  EntityModel.pre("save", function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return EntityModel;
  
};