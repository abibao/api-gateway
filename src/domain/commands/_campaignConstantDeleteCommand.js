"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");
var _ = require("lodash");

var CURRENT_NAME = "CampaignConstantDeleteCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.debug.command(CURRENT_NAME, quid);
      self.CampaignModel.get( self.getIDfromURN(payload.urn) ).run().then(function(campaign) {
        if ( _.isUndefined(campaign.constants) ) { campaign.constants = {}; }
        delete campaign.constants[payload.label];
        return campaign.save().then(function(updated) {
          delete updated.id;
          delete updated.company;
          self.debug.command(CURRENT_NAME, quid);
          resolve(updated);
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