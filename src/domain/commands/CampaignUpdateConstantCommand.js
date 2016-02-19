"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CampaignUpdateConstantCommand';

module.exports = function(params, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemReadDataQuery(self.CampaignModel, params.urn).then(function(campaign) {
      if ( campaign.constants===undefined ) campaign.constants = {};
      campaign.constants[params.label] = params.description;
      return self.SystemValidateDataCommand(campaign).then(function() {
        return self.SystemSaveDataCommand(campaign).then(function(created) {
          callback(null, created);
        });
      });
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
