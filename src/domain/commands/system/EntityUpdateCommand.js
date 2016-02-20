"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'EntityUpdateCommand';

module.exports = function(payload) {

  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.EntityModel.get( self.getIDfromURN(payload.urn) ).run().then(function(model) {
        return model.merge(payload).save().then(function(updated) {
          delete updated.id;
          time_end = new Date();
          self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
          resolve(updated);
        });
      })
      .catch(function(error) {
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
      reject(e);
    }
  });
  
};