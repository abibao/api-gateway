"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");
var _ = require("lodash");
var async = require("async");

var CURRENT_NAME = "CampaignPublishCommand";

module.exports = function(payload) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
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
              if ( _.isUndefined(individual.charity) ) {
                next();
              } else {
                self.individualSendEmailCampaignEvent(data);
                next();
              }
            }, function(err) {
              if (err) { reject(err); }
              self.debug.command(CURRENT_NAME, quid);
              resolve(updated);
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
