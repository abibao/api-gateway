"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = '{{JS_EVENT_NAME}}';

module.exports = function(current, old) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.io.sockets.emit(self.io.{{JS_IO_EVENT_NAME}}, {data:current,old:old});
    self.SystemLogCreateCommand({action:CURRENT_ACTION, name:CURRENT_NAME, data:{current:current,old:old}}); 

  } catch (e) {
    
  }

};