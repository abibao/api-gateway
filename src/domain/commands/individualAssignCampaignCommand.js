"use strict";

var Promise = require("bluebird");
var Iron = require("iron");
var Base64 = require("base64-url");

var nconf = require("nconf");
nconf.argv().env();

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "IndividualAssignCampaignCommand";

module.exports = function(sealed) {

  var self = this;
  var timeStart = new Date();
  var timeEnd;
  
  return new Promise(function(resolve, reject) {
    try {
      sealed = Base64.decode(sealed);
      Iron.unseal(sealed, nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"), Iron.defaults, function (err, unsealed) {
        // control
        if (err) return reject(err);
        if (unsealed.individual===undefined) return reject("Individual is undefined.");
        if (unsealed.campaign===undefined) return reject("Campaign is undefined.");
        if (unsealed.action===undefined) return reject("Action is undefined.");
        if (unsealed.action!==self.ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH) return reject("Action is unauthorized.");
        var data = {
          campaign: unsealed.campaign,
          company: unsealed.company, 
          charity: unsealed.charity, 
          individual: unsealed.individual
        };
        var survey;
        self.SurveyFilterQuery(data).then(function(surveys) {
          if ( surveys.length===0 ) {
            return self.SurveyCreateCommand(data).then(function(survey) {
              return self.individualCreateAuthTokenCommand(survey.urnIndividual).then(function(token) {
                survey.token = token;
                delete survey.campaign;
                delete survey.company;
                delete survey.charity;
                delete survey.individual;
                timeEnd = new Date();
                self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
                resolve(survey);
              });
            });
          } else {
            survey = surveys[0];
            return self.individualCreateAuthTokenCommand(survey.urnIndividual).then(function(token) {
              survey.token = token;
              delete survey.campaign;
              delete survey.company;
              delete survey.charity;
              delete survey.individual;
              timeEnd = new Date();
              self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
              resolve(survey);
            });
          }
        })
        .catch(function(error) {
          timeEnd = new Date();
          self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
          reject(error);
        });
      });
    } catch (e) {
      timeEnd = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
      reject(e);
    }
  });
  
};
