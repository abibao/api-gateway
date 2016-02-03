"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'SystemUpdateDataCommand';

module.exports = function(model, data, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemReadDataQuery(model, data.id).then(function(result) {
      var new_data = result.merge(data);
      return self.SystemValidateDataCommand(new_data).then(function() {
        return self.SystemSaveDataCommand(new_data).then(function(result) {
          callback(null, result);
        });
      });
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};