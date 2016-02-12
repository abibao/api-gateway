"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = '{{JS_QUERY_NAME}}';

module.exports = function(id, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemReadDataQuery(self.{{JS_MODEL_NAME}}, id).then(function(model) {
      callback(null, model);
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }

};