"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'EntityCreateEvent';

module.exports = function(data) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.io.sockets.emit(self.io.EVENT_ENTITY_CREATED, data);
    self.SlackPostMessageCommand('info', CURRENT_NAME+' < '+data.id+' > has been created'); 

  } catch (e) {

  }

};