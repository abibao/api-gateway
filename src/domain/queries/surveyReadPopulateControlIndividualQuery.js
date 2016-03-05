"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "SurveyReadPopulateControlIndividualQuery";
 
module.exports = function(payload) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.surveyReadQuery(payload.urn).then(function(survey) {
        if ( payload.credentials.urn!==survey.urnIndividual ) { return reject( new Error("Individual control failed") ); }
        return self.campaignReadQuery(survey.urnCampaign).then(function(campaign) {
          var idCampaign = self.getIDfromURN(campaign.urn);
          return self.campaignItemFilterQuery({campaign:idCampaign}).then(function(items) {
            campaign.items = items;
            survey.campaign = campaign;
            self.debug.query(CURRENT_NAME, quid);
            resolve(survey);
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