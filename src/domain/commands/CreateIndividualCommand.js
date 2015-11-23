"use strict";

var MD5 = require('md5');

module.exports = function(data, callback) {
 
  var self = this;
  self.action = 'Command';
  self.name = 'CreateIndividualCommand';
  
  delete data.password1;
  delete data.password2;
  data.createdAt = Date.now();
  var individual = new self.IndividualModel(data);
  
  try {
    // test if email is already registered
    self.IndividualModel.get(MD5(data.email)).run()
    .then(function(doc) {
      if (doc) {}
      self.logger.error(self.action, self.name, 'Email already exist in database.');
      return callback(new Error('Email already exist in database.'), null);
    }).catch(self.ThinkyErrors.DocumentNotFound, function(err) {
      if (err) {}
      // validate schema
      try {
        individual.validate();
      }
      catch(err) {
        self.logger.error(self.action, self.name, err);
        return callback(err, null);
      }
      // save the data
      individual
      .save(function(err, doc) {
        if (err) {
          self.logger.error(self.action, self.name, err);
          return callback(err, null);
        }
        // run another command (only in production)
        if (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) self.postMessageOnSlack('info', 'event individualCreated'+' < '+doc.email+' >'); 
        delete doc.password;
        callback(null, doc);
      });
    }).error(function(error) {
      self.logger.error(self.action, self.name, error);
      callback(error, null);
    });
  } catch (e) {
    self.logger.error(self.action, self.name, e);
    callback(e, null);
  }
  
};