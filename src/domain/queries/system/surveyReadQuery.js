"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "SurveyReadQuery";

module.exports = function(urn, callback) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    var quid = uuid.v1();
    try {
      self.SurveyModel.get( self.getIDfromURN(urn) ).run().then(function(model) {
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