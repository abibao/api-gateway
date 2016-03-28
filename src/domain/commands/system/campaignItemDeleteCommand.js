"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignItemDeleteCommand";

module.exports = function(urn) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      
      var quid = uuid.v1();
      var timeStart = new Date();
      
      self.CampaignItemModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
        return model.delete().then(function() {
          var timeEnd = new Date();
          self.debug.query('[%s] %s in %s ms', quid, CURRENT_NAME, timeEnd-timeStart );
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