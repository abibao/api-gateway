"use strict";

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var EntityModel = thinky.createModel("entities", {
    // fields
    name: type.string().required(),
    contact: type.string().email().required(),
    type: type.string().required().default('association'),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  EntityModel.pre('save', function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return EntityModel;
  
};