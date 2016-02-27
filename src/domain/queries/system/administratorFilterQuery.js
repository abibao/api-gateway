"use strict";

var Promise = require("bluebird");
var _ = require('lodash');
var uuid = require('node-uuid');

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'AdministratorFilterQuery';

module.exports = function(filters) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.debug.query('');
      self.AdministratorModel.filter(filters).run().then(function(models) {
        _.map(models, function(model) {
          delete model.id;
          delete model.company;
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