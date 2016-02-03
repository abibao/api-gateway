"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'IndividualCreateEvent';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.io.sockets.emit(self.io.EVENT_INDIVIDUAL_CREATED, data);
    callback(null, true);
    
  } catch (e) {
    callback(e, null);
  }

};