"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");
var newrelic = require("newrelic");

var CURRENT_NAME = "EntityReadQuery";

module.exports = function(urn) {
  
  var self = this;
  var starttime = new Date();
  
  return new Promise(function(resolve, reject) {
    
    try {
      self.EntityModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
        delete model.id;
        delete model.company;
        delete model.charity;
        delete model.campaign;
        delete model.item;
        
        var request = {
          name: CURRENT_NAME,
          uuid: uuid.v1(),
          exectime: new Date() - starttime
        };
        self.logger.info({query:request}, '[query]');
        
        resolve(model);
        
      }).catch(function(error) {
        self.logger.error(error);
        reject(error);
      });
    } catch (e) {
      self.logger.error(e);
      reject(e);
    }
  });

};