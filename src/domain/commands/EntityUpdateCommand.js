"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'EntityUpdateCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemUpdateDataCommand(self.EntityModel, data).then(function(updated) {
      callback(null, updated);
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
