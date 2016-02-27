"use strict";

var CURRENT_NAME = "{{JS_EVENT_NAME}}";

module.exports = function(current, old) {

  var self = this;
  
  var uuid = require("node-uuid");
  self.debug.query(CURRENT_NAME, quid, current, old);

};