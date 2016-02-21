"use strict";

var Promise = require("bluebird");
var async = require('async');

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CampaignPublishCommand';

module.exports = function(payload, callback) {
  
  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.r.table('campaigns').get( self.getIDfromURN(payload.urn) ).then(function(campaign) {
        // TODO :: if ( campaign.publish===true ) return reject('campaign already published');
        campaign.publish = true;
        campaign.urn = payload.urn;
        return self.CampaignUpdateCommand(campaign).then(function(updated) {
          return self.r.table('individuals').filter({}).hasFields(['charity']).then(function(individuals) {
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
            }, function(err, results) {
              time_end = new Date();
              self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
              resolve(updated);
            });
          });
        });
      })
      .catch(function(error) {
        time_end = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
      reject(e);
    }
  });
  
};
