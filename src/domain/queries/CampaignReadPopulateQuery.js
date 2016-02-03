"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'CampaignReadPopulateQuery';
 
module.exports = function(id, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemReadDataQuery(self.CampaignModel, id).then(function(campaign) {
      return self.SystemReadDataQuery(self.EntityModel, campaign.company).then(function(entity) {
        campaign.company = entity;
        return self.SystemFindDataQuery(self.CampaignItemModel, {campaign:id}).then(function(items) {
          campaign.items = items;
          callback(null, campaign);
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