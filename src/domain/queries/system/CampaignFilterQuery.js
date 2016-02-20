"use strict";

var Promise = require("bluebird");
var _ = require('lodash');

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'CampaignFilterQuery';

module.exports = function(filters) {
  
  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.CampaignModel.filter(filters).run().then(function(models) {
        _.map(models, function(model) {
          delete model.id;
        });
        time_end = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        resolve(models);
      }).catch(function(error) {
        time_end = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
      reject(e);
    }
  });

};