"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "IndividualCreateAbibaoSurveyCommand";

module.exports = function(target, position) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.entityFilterQuery({type:'abibao'}).then(function(entities) {
        var entity = entities[0];
        entity.id = self.getIDfromURN(entity.urn);
        return self.campaignFilterQuery({company:entity.id, position:position}).then(function(campaigns) {
          var campaign = campaigns[0];
          var data = {
            campaign: self.getIDfromURN(campaign.urn),
            company: self.getIDfromURN(campaign.urnCompany),
            charity: self.getIDfromURN(campaign.urnCompany),
            individual: self.getIDfromURN(target),
            answers: {}
          };
          return self.surveyCreateCommand(data).then(function(survey) {
            var payload = {
              urn: survey.urn,
              credentials: {
                urn: target
              }
            };
            return self.surveyReadPopulateControlIndividualQuery(payload).then(function() {
              self.debug.command(CURRENT_NAME, quid);
              resolve();
            });
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