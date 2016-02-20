"use strict";

var Promise = require("bluebird");
var _ = require('lodash');

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'CampaignReadPopulateQuery';
 
module.exports = function(urn) {
  
  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.CampaignReadQuery(urn).then(function(campaign) {
        self.EntityReadQuery(campaign.urnCompany).then(function(entity) {
          delete campaign.urnCompany;
          campaign.company = entity;
          self.CampaignItemFilterQuery({campaign:self.getIDfromURN(urn)}).then(function(items) {
            _.map(items, function(item) {
              delete item.campaign;
            });
            campaign.items = items;
            time_end = new Date();
            self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
            resolve(campaign);
          })
          .catch(function(error) {
            time_end = new Date();
            self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
            reject(error);
          });
        })
        .catch(function(error) {
          time_end = new Date();
          self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
          reject(error);
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

