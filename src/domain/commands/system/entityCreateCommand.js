"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_NAME = "EntityCreateCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      var model = new self.EntityModel(payload);
      model.id = new ObjectId().toString();
      model.createdAt = Date.now();
      model.save().then(function(created) {
        delete created.id;
        delete created.company;
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