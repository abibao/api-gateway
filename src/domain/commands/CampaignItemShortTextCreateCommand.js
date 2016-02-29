"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignItemShortTextCreateCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.debug.command(CURRENT_NAME, quid);
      self.campaignReadQuery(payload.campaign).then(function(campaign) {
        payload.campaign = self.getIDfromURN(payload.campaign);
        payload.type = "ABIBAO_COMPONENT_SHORT_TEXT";
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