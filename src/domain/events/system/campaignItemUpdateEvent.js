"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignItemUpdateEvent";

module.exports = function(data) {

  var self = this;
  
  var quid = uuid.v1();
  self.debug.query(CURRENT_NAME, quid, data);

};