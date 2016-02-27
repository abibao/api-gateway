"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "IndividualSendEmailCampaignEvent";

module.exports = function(data) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.individualSendEmailCampaignCommand(data).then(function() {
        self.debug.command(CURRENT_NAME, quid);
        resolve();
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};