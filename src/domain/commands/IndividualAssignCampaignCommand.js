"use strict";

var Iron = require('iron');
var Base64 = require('base64-url');

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'IndividualAssignCampaignCommand';

module.exports = function(sealed, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    sealed = Base64.decode(sealed);
    
    Iron.unseal(sealed, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, Iron.defaults, function (err, unsealed) {
      // control
      if (err) return callback(err, null);
      if (unsealed.individual===undefined) return callback('Individual is undefined.', null);
      if (unsealed.campaign===undefined) return callback('Campaign is undefined.', null);
      if (unsealed.action===undefined) return callback('Action is undefined.', null);
      if (unsealed.action!==self.ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH) return callback('Action is unauthorized.', null);
      var data = {
        campaign: unsealed.campaign,
        company: unsealed.company, 
        charity: unsealed.charity, 
        individual: unsealed.individual
      };
      self.SystemFindDataQuery(self.SurveyModel, data).then(function(surveys) {
        return self.IndividualCreateAuthTokenCommand({id:data.individual,scope:'individual'}).then(function(token) {
          if ( surveys.length===0 ) {
            self.SurveyCreateCommand(data).then(function(survey) {
              survey.token = token;
              callback(null, survey);
            })
            .catch(function(error) {
              callback(error, null);
            });
          } else {
            var survey = surveys[0];
            survey.token = token;
            callback(null, survey);
          }
        });
      })
      .catch(function(error) {
        callback(error, null);
      });
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};
