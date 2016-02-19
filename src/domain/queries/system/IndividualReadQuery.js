"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'IndividualReadQuery';

module.exports = function(urn, callback) {
  
  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.IndividualModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
        delete model.id;
        time_end = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        resolve(model);
      }).catch(function(error) {
        time_end = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, 'local', '('+(time_end-time_start)+'ms)');
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, 'glogal', '('+(time_end-time_start)+'ms)');
      reject(e);
    }
  });

};