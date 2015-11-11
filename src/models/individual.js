"use strict";

// External modules.
var Joi = require('joi');
var Bcrypt = require('bcrypt');
var _ = require('lodash');

// System modules.

// Declare internals
var internals = {};

// declare const
var SALT_WORK_FACTOR = 10;

////////////////////////
// @constructor
////////////////////////

exports = module.exports = internals.Individual = function(data) {
  var self = this;
  if (data) self.data = data;
  self.schema = Joi.object().keys({
    email: Joi.string().email().required(),
    hashedPassword: Joi.string().required(),
    created: Joi.date().default(Date.now, 'time of creation').required()
  });
  console.log(self.schema);
};

internals.Individual.prototype.validate = function(callback) {
  var self = this;
  Joi.validate(self.data, self.schema, function (err, value) {
    callback(err, value);
  });
};

internals.Individual.prototype.update = function(data, callback) {
  var self = this;
  _.merge(self.data, data);
  if (!self.data.password && data.password) {
    // generate a salt
    Bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return callback(err);
      // hash the password along with our new salt
      Bcrypt.hash(data.password, salt, function(err, hash) {
        if (err) return callback(err);
        // override the cleartext password with the hashed one
        self.data.password = hash;
        callback();
      });
    });
  } else {
    callback();
  } 
};


/*IndividualSchema.methods.comparePassword = function(candidatePassword, cb) {
  Bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}; */

/**
var Bcrypt = require('bcrypt');

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var mongooseHidden = require('mongoose-hidden')({ defaultHidden: { id: false } });

var SALT_WORK_FACTOR = 10;

var IndividualSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true, hide: true },
  scope: { type: String, required: true, default: 'individual' }
});

IndividualSchema.plugin(mongooseHidden);

IndividualSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  // generate a salt
  Bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    // hash the password along with our new salt
    Bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

IndividualSchema.methods.comparePassword = function(candidatePassword, cb) {
  Bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}; 

IndividualSchema.set('versionKey', false);

module.exports = Mongoose.model('individual', IndividualSchema, process.env.ABIBAO_USER_INDIVIDUAL_DATABASE_COLLECTION_INDIVIDUALS);
**/