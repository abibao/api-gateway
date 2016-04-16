"use strict";

var Promise = require("bluebird");

module.exports = function(urn) {
  
  var CURRENT_NAME = "CampaignDeleteCommand";
  
  var self = this;
  var starttime = new Date();
  
  self.debug.command('%s %s', CURRENT_NAME, urn);
  
  return new Promise(function(resolve, reject) {
    try {
      self.CampaignModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
        return model.delete().then(function() {
          var request = {
            name: CURRENT_NAME,
            exectime: new Date() - starttime
          };
          self.logger.info({command:request}, '[command]');
          resolve({deleted:true});
        });
      })
      .catch(function(error) {
        self.debug.error('%s %o', CURRENT_NAME, error);
        reject(error);
      });
    } catch (e) {
      self.debug.error('%s %o', CURRENT_NAME, e);
      reject(e);
    }
  });
  
};