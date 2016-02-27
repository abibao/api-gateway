"use strict";

var nconf = require("nconf");
nconf.argv().env();

var Cryptr = require("cryptr"),
cryptr = new Cryptr(nconf.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var CampaignItemModel = thinky.createModel("campaigns_items", {
    // virtuals
    urn: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : "urn:abibao:campaign:item:"+cryptr.encrypt(this.id);
    }),
    // fields
    optional: type.boolean().required().default(false),
    title: type.string().required(),
    description: type.string(),
    component: type.object().required(),
    answer: type.object().required(),
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