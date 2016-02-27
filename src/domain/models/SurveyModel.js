"use strict";

var nconf = require("nconf");
nconf.argv().env();

var Cryptr = require("cryptr"),
cryptr = new Cryptr(nconf.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var SurveyModel = thinky.createModel("surveys", {
    // virtuals
    urn: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : "urn:abibao:survey:"+cryptr.encrypt(this.id);
    }),
    urnCampaign: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : "urn:abibao:campaign:"+cryptr.encrypt(this.campaign);
    }),
    urnCompany: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : "urn:abibao:entity:"+cryptr.encrypt(this.company);
    }),
    urnCharity: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : "urn:abibao:entity:"+cryptr.encrypt(this.charity);
    }),
    urnIndividual: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : "urn:abibao:individual:"+cryptr.encrypt(this.individual);
    }),
    // linked
    campaign: type.string().required(),
    company: type.string().required(), // entité de type "entreprise" qui fournit le sondage
    charity: type.string().required(), // "entity" de type "assocation" à qui profite le sondage
    individual: type.string().required(), // "user" de type "individual" à qui est affecté le sondage
    // 
    answers: type.object(),
    complete: type.boolean().default(false),
    completeAt: type.date(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  SurveyModel.pre("save", function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return SurveyModel;
  
};