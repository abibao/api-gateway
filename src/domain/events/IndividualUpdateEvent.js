"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'IndividualUpdateEvent';

module.exports = function(data, old, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.io.sockets.emit(self.io.EVENT_INDIVIDUAL_CREATED, data);
    self.postMessageOnSlack('info', CURRENT_NAME+' < '+data.email+' > has been updated'); 
    
    callback(null, true);
    
  } catch (e) {
    callback(e, null);
  }

};