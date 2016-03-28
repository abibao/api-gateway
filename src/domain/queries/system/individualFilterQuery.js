"use strict";

var Promise = require("bluebird");
var _ = require("lodash");
var uuid = require("node-uuid");

var CURRENT_NAME = "IndividualFilterQuery";

module.exports = function(filters) {
  
  var self = this;
  var starttime = new Date();
  
  return new Promise(function(resolve, reject) {
    try {
        
      self.IndividualModel.filter(filters).run().then(function(models) {
        _.map(models, function(model) {
          delete model.id;
          delete model.company;
          delete model.charity;
          delete model.campaign;
          delete model.item;
        });
        
        var request = {
          name: CURRENT_NAME,
          uuid: uuid.v1(),
          exectime: new Date() - starttime
        };
        self.logger.info({query:request}, '[query]');
        
        resolve(models);
      }).catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });

};