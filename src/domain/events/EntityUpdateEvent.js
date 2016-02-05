"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'EntityUpdateEvent';

module.exports = function(data, old, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.io.sockets.emit(self.io.EVENT_ENTITY_UPDATED, data);
    self.postMessageOnSlack('info', CURRENT_NAME+' < '+data.name+' > has been updated'); 
    
    callback(null, true);
    
  } catch (e) {
    callback(e, null);
  }

};