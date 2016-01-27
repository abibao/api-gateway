"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'FindDataQuery';

module.exports = function(model, filter, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, model, 'execute', model);
    
    model.filter(filter).run().then(function(results) {
      callback(null, results);
    })
    .error(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};