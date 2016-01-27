"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'UpdateIndividualCommand';

module.exports = function(data, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.ReadDataQuery(self.IndividualModel, data.id).then(function(result) {
      var user = result.merge(data);
      return self.ValidateDataCommand(user).then(function() {
        return self.SaveDataCommand(user).then(function(result) {
          callback(null, result);
        });
      });
    })
    .error(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};