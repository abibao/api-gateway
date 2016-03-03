"use strict";

var Promise = require("bluebird");
var _ = require("lodash");
var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignReadPopulateQuery";
 
module.exports = function(urn) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.campaignReadQuery(urn).then(function(campaign) {
        self.entityReadQuery(campaign.urnCompany).then(function(entity) {
          delete campaign.urnCompany;
          campaign.company = entity;
          self.campaignItemFilterQuery({campaign:self.getIDfromURN(urn)}).then(function(items) {
            _.map(items, function(item) {
              delete item.campaign;
            });
            campaign.items = items;
            self.debug.query(CURRENT_NAME, quid);
            resolve(campaign);
          })
          .catch(function(error) {
            reject(error);
          });
        })
        .catch(function(error) {
          reject(error);
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

