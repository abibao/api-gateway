"use strict";

var {{JS_SCHEMA_NAME}} = require('./../schemas/{{JS_SCHEMA_NAME}}');

module.exports = function(thinky) {

  var type = thinky.type;
  var r = thinky.r;
  var schema = new {{JS_SCHEMA_NAME}}.Schema(thinky);
  
  var {{JS_MODEL_NAME}} = thinky.createModel('{{JS_TABLE_NAME}}', schema); 
  
  {{JS_MODEL_NAME}}.pre('save', function(next) {
    var data = this;
    next();
  });
  
  return {{JS_MODEL_NAME}};
  
}