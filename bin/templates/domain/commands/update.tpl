"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = '{{JS_COMMAND_NAME}}';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemUpdateDataCommand(self.{{JS_MODEL_NAME}}, data).then(function(updated) {
      callback(null, updated);
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }

};