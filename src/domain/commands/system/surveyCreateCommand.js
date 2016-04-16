"use strict";

var Promise = require("bluebird");

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(payload) {
  
  var CURRENT_NAME = "SurveyCreateCommand";
  
  var self = this;
  var starttime = new Date();
  
  self.debug.command('%s %o', CURRENT_NAME, payload);
  
  return new Promise(function(resolve, reject) {
    try {
      payload.id = new ObjectId().toString();
      payload.createdAt = Date.now();
      var model = new self.SurveyModel(payload);
      model.save().then(function(created) {
        delete created.id;
        delete created.company;
        delete created.charity;
        delete created.campaign;
        delete created.item;
        var request = {
          name: CURRENT_NAME,
          exectime: new Date() - starttime
        };
        self.logger.info({command:request}, '[command]');
        resolve(created);
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