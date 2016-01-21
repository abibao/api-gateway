"use strict";

var crypto = require('crypto');

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var IndividualModel = thinky.createModel("individuals", {
    // fields
    email: type.string().email().required(),
    scope: type.string().default('individual'),
    verified: type.boolean().default(false),
    // calculated
    hashedPassword: type.string(),
    salt: type.string(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  IndividualModel.pre('save', function(next) {
    var user = this;
    // salt exists ?
    if (user.salt) return next();
    user.salt = this.makeSalt();
    user.hashedPassword = user.encryptPassword(user.password);
    delete user.password;
    next();
  });
  
  IndividualModel.define("authenticate", function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  });
  
  IndividualModel.define("makeSalt", function() {
    return crypto.randomBytes(16).toString('base64');
  });
  
  IndividualModel.define("encryptPassword", function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  });
  
  return IndividualModel;
  
};