"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignDeleteEvent";

module.exports = function(current, old) {

  var self = this;
  
  var quid = uuid.v1();
  self.debug.query(CURRENT_NAME, quid, current, old);

};