"use strict";

var async = require('async');

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CampaignPublishCommand';

module.exports = function(params, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemReadDataQuery(self.CampaignModel, params.campaign).then(function(campaign) {
      // if ( campaign.publish===true ) return callback('campaign already published', null);
      if ( campaign.company!==params.entity ) return callback('Entity not allowed', null);
      campaign.publish = true;
      return self.SystemUpdateDataCommand(self.CampaignModel, campaign).then(function() {
        return self.SystemFindDataQuery(self.IndividualModel, {}).then(function(individuals) {
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
              self.IndividualSendEmailCampaignEvent(data);
              next();
            }
          }, function(err, results){
            if (err) {
              return callback(null, campaign);
            }
            if (results) {}
            callback(null, campaign);
          });
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
