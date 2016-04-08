"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_NAME = "EntityCreateCommand";

module.exports = function(payload) {

  var self = this;
  var starttime = new Date();
  
  return new Promise(function(resolve, reject) {
    try {
      
      payload.id = new ObjectId().toString();
      payload.createdAt = Date.now();
      var model = new self.EntityModel(payload);
      model.save().then(function(created) {
        delete created.id;
        delete created.company;
        delete created.charity;
        delete created.campaign;
        delete created.item;
        
        var request = {
          name: CURRENT_NAME,
          uuid: uuid.v1(),
          exectime: new Date() - starttime
        };
        self.logger.info({command:request}, '[command]');
        
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