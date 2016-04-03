"use strict";

var Promise = require("bluebird");

var CURRENT_NAME = "CampaignItemReadPopulateQuery";
 
module.exports = function(urn) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      self.campaignItemReadQuery(urn).then(function(campaignItem) {
        return self.campaignItemChoiceFilterQuery({item:self.getIDfromURN(urn)}).then(function(choices) {
          campaignItem.choices = choices;
          resolve(campaignItem);
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

