"use strict";

var CURRENT_ACTION = "Query";
var CURRENT_NAME = "SurveyReadPopulateControlIndividualQuery";
 
module.exports = function(credentials, params, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "execute");
    
    self.SystemReadDataQuery(self.SurveyModel, params.urn).then(function(survey) {
      if ( credentials.id!==survey.individual ) return callback("Individual control failed", null);
      return self.SystemReadDataQuery(self.CampaignModel, survey.campaign).then(function(campaign) {
        survey.campaign = campaign;
        return self.SystemFindDataQuery(self.CampaignItemModel, {campaign:campaign.id}).then(function(items) {
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