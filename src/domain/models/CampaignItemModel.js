"use strict";

var _ = require("lodash");
var nconf = require("nconf");
nconf.argv().env();

var Cryptr = require("cryptr"),
cryptr = new Cryptr(nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"));

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var CampaignItemModel = thinky.createModel("campaigns_items", {
    // virtuals
    urn: type.virtual().default(function() {
      return _.isUndefined(this.id)  ? null : "urn:abibao:database:campaign:item:"+cryptr.encrypt(this.id);
    }),
    // fields
    label: type.string().required(),
    type: type.string().required(),
    tags: type.string(),
    position: type.number().min(0).default(0),
    // linked
    campaign: type.string().required(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  CampaignItemModel.pre("save", function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return CampaignItemModel;
  
};