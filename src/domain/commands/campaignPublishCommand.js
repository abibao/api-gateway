"use strict";

var Promise = require("bluebird");
var async = require("async");

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "CampaignPublishCommand";

module.exports = function(payload, callback) {
  
  var self = this;
  var timeStart = new Date();
  var timeEnd;
  
  return new Promise(function(resolve, reject) {
    try {
      self.r.table("campaigns").get( self.getIDfromURN(payload.urn) ).then(function(campaign) {
        // TODO :: if ( campaign.publish===true ) return reject("campaign already published");
        campaign.publish = true;
        campaign.urn = payload.urn;
        return self.campaignUpdateCommand(campaign).then(function(updated) {
          return self.r.table("individuals").filter({}).hasFields(["charity"]).then(function(individuals) {
            async.map(individuals, function(individual, next) {
              var data = {
                individual: individual.id,
                charity: individual.charity,
                email: individual.email,
                campaign: campaign.id,
                company: campaign.company
              };
              if ( individual.charity===undefined ) {
                next();
              } else {
                self.individualSendEmailCampaignEvent(data);
                next();
              }
            }, function(err, results) {
              timeEnd = new Date();
              self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
              resolve(updated);
            });
          });
        });
      })
      .catch(function(error) {
        timeEnd = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
        reject(error);
      });
    } catch (e) {
      timeEnd = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
      reject(e);
    }
  });
  
};
