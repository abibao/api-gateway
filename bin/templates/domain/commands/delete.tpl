"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = '{{JS_COMMAND_NAME}}';

module.exports = function(id, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemDeleteDataCommand(self.{{JS_MODEL_NAME}}, id).then(function() {
      callback();
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }

};