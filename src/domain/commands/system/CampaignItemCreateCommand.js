"use strict";

var Promise = require("bluebird");

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CampaignItemCreateCommand';

module.exports = function(payload) {

  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      var model = new self.CampaignItemModel(payload);
      model.id = new ObjectId().toString();
      model.createdAt = Date.now();
      model.save().then(function(created) {
        delete created.id;
        time_end = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        resolve(created);
      })
      .catch(function(error) {
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