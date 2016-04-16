"use strict";

var Promise = require("bluebird");

module.exports = function(payload) {
  var self = this;
  return new Promise(function(resolve, reject) {
    try {
      payload.item = self.getIDfromURN(payload.item);
      payload.campaign = self.getIDfromURN(payload.campaign);
      self.execute('command', 'campaignItemChoiceCreateCommand', payload).then(function(choice) {
        return self.execute('query', 'campaignItemChoiceReadQuery', choice.urn).then(function(choice) {
          resolve(choice);
        });
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};