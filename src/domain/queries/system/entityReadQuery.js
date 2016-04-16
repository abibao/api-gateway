"use strict";

var Promise = require("bluebird");

module.exports = function(urn) {
  
  var CURRENT_NAME = "EntityReadQuery";
  
  var self = this;
  var starttime = new Date();
  
  self.debug.query('%s %s', CURRENT_NAME, urn);
  
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
          exectime: new Date() - starttime
        };
        self.logger.info({query:request}, '[query]');
        resolve(model);
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