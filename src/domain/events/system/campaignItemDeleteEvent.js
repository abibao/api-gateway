"use strict";

var CURRENT_NAME = "CampaignItemDeleteEvent";

module.exports = function(current, old) {

  var self = this;
  
  var uuid = require("node-uuid");
  self.debug.query(CURRENT_NAME, quid, current, old);

};