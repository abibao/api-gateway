"use strict";

var CURRENT_ACTION = "Event";
var CURRENT_NAME = "{{JS_EVENT_NAME}}";

module.exports = function(data) {

  var self = this;
  
  self.logger.debug(CURRENT_ACTION, CURRENT_NAME);

};