"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignUpdateCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.CampaignModel.get( self.getIDfromURN(payload.urn) ).run().then(function(model) {
        return model.merge(payload).save().then(function(updated) {
          delete updated.id;
          delete updated.company;
          delete updated.charity;
          delete updated.campaign;
          delete updated.item;
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