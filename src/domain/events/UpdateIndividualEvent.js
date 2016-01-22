"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'UpdateIndividualEvent';

module.exports = function(data, old, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.io.sockets.emit(self.io.EVENT_INDIVIDUAL_UPDATED, {data:data,old:old});
    callback(null, true);
    
  } catch (e) {
    callback(e, null);
  }

};