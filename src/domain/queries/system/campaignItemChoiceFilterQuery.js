"use strict";

var Promise = require("bluebird");
var _ = require("lodash");
var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignItemChoiceFilterQuery";

module.exports = function(filters) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.CampaignItemChoiceModel.filter(filters).run().then(function(models) {
        _.map(models, function(model) {
          delete model.id;
          delete model.company;
          delete model.charity;
          delete model.campaign;
          delete model.item;
        });
        self.debug.query(CURRENT_NAME, quid);
        resolve(models);
      }).catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });

};