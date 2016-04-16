"use strict";

var Promise = require("bluebird");

module.exports = function(payload) {
  
  var CURRENT_NAME = "{{JS_COMMAND_NAME}}";
  
  var self = this;
  var starttime = new Date();
  
  self.debug.command('%s %o', CURRENT_NAME, payload);
  
  return new Promise(function(resolve, reject) {
    try {
      self.{{JS_MODEL_NAME}}.get( self.getIDfromURN(payload.urn) ).run().then(function(model) {
        return model.merge(payload).save().then(function(updated) {
          delete updated.id;
          delete updated.company;
          delete updated.charity;
          delete updated.campaign;
          delete updated.item;
          var request = {
            name: CURRENT_NAME,
            exectime: new Date() - starttime
          };
          self.logger.info({command:request}, '[command]');
          resolve(updated);
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