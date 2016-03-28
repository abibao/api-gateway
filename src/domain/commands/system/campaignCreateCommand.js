"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_NAME = "CampaignCreateCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      
      var quid = uuid.v1();
      var timeStart = new Date();
      
      payload.id = new ObjectId().toString();
      payload.createdAt = Date.now();
      var model = new self.CampaignModel(payload);
      model.save().then(function(created) {
        delete created.id;
        delete created.company;
        delete created.charity;
        delete created.campaign;
        delete created.item;
        var timeEnd = new Date();
        self.debug.query('[%s] %s in %s ms', quid, CURRENT_NAME, timeEnd-timeStart );
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