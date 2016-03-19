"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignItemChoiceDeleteCommand";

module.exports = function(urn) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.CampaignItemChoiceModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
        return model.delete().then(function() {
          self.debug.command(CURRENT_NAME, quid);
          resolve({deleted:true});
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