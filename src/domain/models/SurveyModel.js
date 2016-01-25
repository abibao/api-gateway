"use strict";

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var SurveyModel = thinky.createModel("surveys", {
    // fields
    name: type.string().required(),
    description: type.string(),
    constants: type.object(),
    // linked
    entity: type.string().required(),
    individual: type.string(),
    items: type.array(),
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