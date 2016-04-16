"use strict";

var Promise = require("bluebird");
var _ = require("lodash");

module.exports = function(filters) {
  
  var CURRENT_NAME = "CampaignItemChoiceFilterQuery";
  
  var self = this;
  var starttime = new Date();
  
  self.debug.query('%s %o', CURRENT_NAME, filters);
  
  return new Promise(function(resolve, reject) {
    try {
      self.CampaignItemChoiceModel.filter(filters).run().then(function(models) {
        _.map(models, function(model) {
          delete model.id;
          delete model.company;
          delete model.charity;
          delete model.campaign;
          delete model.item;
        });
        var request = {
          name: CURRENT_NAME,
          exectime: new Date() - starttime
        };
        self.logger.info({query:request}, '[query]');
        resolve(models);
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