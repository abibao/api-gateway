"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "EntityUpdateCommand";

module.exports = function(payload) {

  var self = this;
  var starttime = new Date();
  
  return new Promise(function(resolve, reject) {
    try {
      
      self.EntityModel.get( self.getIDfromURN(payload.urn) ).run().then(function(model) {
        return model.merge(payload).save().then(function(updated) {
          delete updated.id;
          delete updated.company;
          delete updated.charity;
          delete updated.campaign;
          delete updated.item;
          
          var request = {
            name: CURRENT_NAME,
            uuid: uuid.v1(),
            exectime: new Date() - starttime
          };
          self.logger.info({command:request}, '[command]');
          
          resolve(updated);
        });
      })
      .catch(function(error) {
        self.logger.error(error);
        reject(error);
      });
    } catch (e) {
      self.logger.error(e);
      reject(e);
    }
  });
  
};