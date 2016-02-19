"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'AdministratorDeleteCommand';

module.exports = function(urn) {

  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.AdministratorModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
        return model.delete().then(function() {
          time_end = new Date();
          self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
          resolve({deleted:true});
        });
      })
      .catch(function(error) {
        time_end = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, 'local', '('+(time_end-time_start)+'ms)');
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, 'global', '('+(time_end-time_start)+'ms)');
      reject(e);
    }
  });
  
};