"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignItemChoiceCreateWithCampaignAssignCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      payload.item = self.getIDfromURN(payload.item);
      payload.campaign = self.getIDfromURN(payload.campaign);
      self.campaignItemChoiceCreateCommand(payload).then(function(choice) {
        return self.campaignItemChoiceReadQuery(choice.urn).then(function(choice) {
          self.debug.command(CURRENT_NAME, quid);
          resolve(choice);
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