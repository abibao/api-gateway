"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "AdministratorCreateEvent";

module.exports = function(data) {

  var self = this;
  
  var quid = uuid.v1();
  self.debug.event(CURRENT_NAME, quid, data);

};