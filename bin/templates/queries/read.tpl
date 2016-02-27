"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "{{JS_QUERY_NAME}}";

module.exports = function(urn, callback) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    var quid = uuid.v1();
    try {
      self.{{JS_MODEL_NAME}}.get( self.getIDfromURN(urn) ).run().then(function(model) {
        delete model.id;
        delete model.company;
        self.debug.query(CURRENT_NAME, quid);
        resolve(model);
      }).catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });

};