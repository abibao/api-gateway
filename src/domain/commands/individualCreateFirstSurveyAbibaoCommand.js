"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "IndividualCreateFirstSurveyAbibaoCommand";

module.exports = function(individual) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.campaignFilterQuery({abibao:1}).then(function(campaigns) {
        var campaign = campaigns[0];
        var data = {
          campaign: self.getIDfromURN(campaign.urn),
          company: self.getIDfromURN(campaign.urnCompany),
          charity: self.getIDfromURN(campaign.urnCompany),
          individual: self.getIDfromURN(individual.urn)
        };console.log(data);
        return self.surveyCreateCommand(data).then(function(survey) {
          var payload = {
            urn: survey.urn,
            credentials: {
              urn: individual.urn
            }
          };
          return self.surveyReadPopulateControlIndividualQuery(payload).then(function() {
            self.debug.command(CURRENT_NAME, quid);
            resolve();
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