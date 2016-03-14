"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignItemYesNoCreateCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.debug.command(CURRENT_NAME, quid);
      self.campaignReadQuery(payload.campaign).then(function() {
        payload.campaign = self.getIDfromURN(payload.campaign);
        payload.type = "ABIBAO_COMPONENT_YES_NO";
        return self.campaignItemCreateCommand(payload).then(function(campaign) {
          self.debug.command(CURRENT_NAME, quid);
          resolve(campaign);
        });
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};