"use strict";

var Cryptr = require("cryptr"),
cryptr = new Cryptr(process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;

  var CampaignModel = thinky.createModel("campaigns", {
    // virtuals
    urn: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : 'urn:abibao:campaign:'+cryptr.encrypt(this.id);
    }),
    urnCompany: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : 'urn:abibao:entity:'+cryptr.encrypt(this.company);
    }),
    // fields
    name: type.string().required(),
    description: type.string(),
    price: type.number().min(0).required(),
    currency: type.string().enum(['EUR']).required(), // ISO 4217 : https://fr.wikipedia.org/wiki/ISO_4217
    constants: type.object(),
    // linked
    company: type.string().required(), // entité de type "company" qui fournit le sondage
    // automatic
    publish: type.boolean().default(false),
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  CampaignModel.pre('save', function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return CampaignModel;
  
};