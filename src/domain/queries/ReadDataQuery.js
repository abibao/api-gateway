"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'ReadDataQuery';

module.exports = function(model, id, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, model, 'execute');
    
    model.get(id).run().then(function(item) {
      callback(null, item);
    }).catch(self.ThinkyErrors.DocumentNotFound, function(err) {
      callback(err, null);
    }).error(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};