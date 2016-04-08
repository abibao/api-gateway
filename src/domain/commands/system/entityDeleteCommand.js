"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "EntityDeleteCommand";

module.exports = function(urn) {

  var self = this;
  var starttime = new Date();
  
  return new Promise(function(resolve, reject) {
    try {
      
      self.EntityModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
        return model.delete().then(function() {
          
          var request = {
            name: CURRENT_NAME,
            uuid: uuid.v1(),
            exectime: new Date() - starttime
          };
          self.logger.info({command:request}, '[command]');
          
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