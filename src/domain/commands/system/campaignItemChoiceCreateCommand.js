"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_NAME = "CampaignItemChoiceCreateCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      payload.id = new ObjectId().toString();
      payload.createdAt = Date.now();
      var model = new self.CampaignItemChoiceModel(payload);
      model.save().then(function(created) {
        delete created.id;
        delete created.company;
        delete created.charity;
        delete created.campaign;
        delete created.item;
        self.debug.command(CURRENT_NAME, quid);
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