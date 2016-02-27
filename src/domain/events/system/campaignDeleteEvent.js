"use strict";

var CURRENT_NAME = "CampaignDeleteEvent";

module.exports = function(current, old) {

  var self = this;
  
  var uuid = require("node-uuid");
  self.debug.query(CURRENT_NAME, quid, current, old);

};