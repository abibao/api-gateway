"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignConstantDeleteCommand";

module.exports = function(params) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.SystemReadDataQuery(self.CampaignModel, params.urn).then(function(campaign) {
        if ( campaign.constants===undefined ) campaign.constants = {};
        delete campaign.constants[params.label];
        return self.SystemValidateDataCommand(campaign).then(function() {
          return self.SystemSaveDataCommand(campaign).then(function(created) {
            self.debug.command(CURRENT_NAME, quid);
            resolve(created);
          });
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
