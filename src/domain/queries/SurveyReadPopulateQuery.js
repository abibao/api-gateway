"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'SurveyReadPopulateQuery';
 
module.exports = function(id, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemReadDataQuery(self.SurveyModel, id).then(function(survey) {
      return self.SystemReadDataQuery(self.CampaignModel, survey.campaign).then(function(campaign) {
        survey.campaign = campaign;
        return callback(null, survey);
      });
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};