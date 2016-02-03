"use strict";

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var SurveyModel = thinky.createModel("surveys", {
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
  
  SurveyModel.pre('save', function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return SurveyModel;
  
};