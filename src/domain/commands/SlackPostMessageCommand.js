"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'SlackPostMessageCommand';

module.exports = function(type, message) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.logger_slack[type](message);
    
  } catch (e) {
    
  }
};