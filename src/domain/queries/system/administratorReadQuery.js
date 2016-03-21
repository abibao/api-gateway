"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "AdministratorReadQuery";

module.exports = function(urn) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    
    var quid = uuid.v1();
    self.debug.query('%s - %s start', CURRENT_NAME, quid );
    
    try {
      self.AdministratorModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
        delete model.id;
        delete model.company;
        delete model.charity;
        delete model.campaign;
        delete model.item;
        resolve(model);
      }).catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });

};