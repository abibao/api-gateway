"use strict";

var Promise = require("bluebird");
var Iron = require("iron");
var Base64 = require("base64-url");
var uuid = require("node-uuid");
var _ = require("lodash");

var nconf = require("nconf");
nconf.argv().env();

var CURRENT_NAME = "IndividualAssignCampaignCommand";

module.exports = function(sealed) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      sealed = Base64.decode(sealed);
      Iron.unseal(sealed, nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"), Iron.defaults, function (err, unsealed) {
        // control
        if (err) {
          return reject(err);
        }
        if ( _.isUndefined(unsealed.individual) ) { return reject( new Error("Individual is undefined.") ); }
        if ( _.isUndefined(unsealed.campaign) ) { return reject( new Error("Campaign is undefined.") ); }
        if ( _.isUndefined(unsealed.action) ) { return reject( new Error("Action is undefined.") ); }
        if (unsealed.action!==self.ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH) { return reject( new Error("Action is unauthorized.") ); }
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
                self.debug.command(CURRENT_NAME, quid);
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
              self.debug.command(CURRENT_NAME, quid);
              resolve(survey);
            });
          }
        })
        .catch(function(error) {
          reject(error);
        });
      });
    } catch (e) {
      reject(e);
    }
  });
  
};
