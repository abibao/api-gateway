"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "{{JS_COMMAND_NAME}}";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.{{JS_MODEL_NAME}}.get( self.getIDfromURN(payload.urn) ).run().then(function(model) {
        return model.merge(payload).save().then(function(updated) {
          delete updated.id;
          delete updated.company;
          self.debug.command(CURRENT_NAME, quid);
          resolve(updated);
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