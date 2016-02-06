"use strict";

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var CampaignModel = thinky.createModel("campaigns", {
    // fields
    name: type.string().required(),
    description: type.string(),
    price: type.number().min(0).required(),
    currency: type.string().required(), // ISO 4217 : https://fr.wikipedia.org/wiki/ISO_4217
    constants: type.object(),
    // linked
    company: type.string().required(), // entité de type "entreprise" qui fournit le sondage
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