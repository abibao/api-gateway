"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "{{JS_EVENT_NAME}}";

module.exports = function(data) {

  var self = this;
  
  var quid = uuid.v1();
  self.debug.query(CURRENT_NAME, quid, data);

};