"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CampaignItemCreateCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    data.id = new ObjectId().toString();
    data.createdAt = Date.now();
    data.modifiedAt = data.createdAt;
    data.component = JSON.parse(data.component);
    var campaign_item = new self.CampaignItemModel(data);
    
    self.SystemReadDataQuery(self.CampaignModel, data.campaign).then(function(campaign) {
      campaign_item.campaign = campaign.id;
      return self.SystemValidateDataCommand(campaign_item).then(function() {
        return self.SystemSaveDataCommand(campaign_item).then(function() {
          callback(null, campaign_item);
        });
      });
    })
    .catch(function(error) {
      data.delete().then(function() {
      });
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
