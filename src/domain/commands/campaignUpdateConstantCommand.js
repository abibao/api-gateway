"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");
var _ = require("lodash");

var CURRENT_NAME = "CampaignUpdateConstantCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.debug.command(CURRENT_NAME, quid);
      self.campaignReadQuery(payload.urn).then(function(campaign) {
        if ( _.isUndefined(campaign.constants) ) { campaign.constants = {}; }
        campaign.constants[payload.label] = payload.description;
        return self.campaignUpdateCommand(campaign).then(function(campaign) {
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
