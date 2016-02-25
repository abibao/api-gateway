"use strict";

var Promise = require("bluebird");
var uuid = require('node-uuid');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CampaignItemCreateCommand';

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.debug.query('');
      var model = new self.CampaignItemModel(payload);
      model.id = new ObjectId().toString();
      model.createdAt = Date.now();
      model.save().then(function(created) {
        delete created.id;
        delete created.company;
        self.debug.query(CURRENT_NAME, quid);
        resolve(created);
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};