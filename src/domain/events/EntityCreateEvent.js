"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'EntityCreateEvent';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.io.sockets.emit(self.io.EVENT_ENTITY_CREATED, data);
    self.postMessageOnSlack('info', CURRENT_NAME+' < '+data.name+' > has been created'); 
    
    callback(null, true);
    
  } catch (e) {
    callback(e, null);
  }

};