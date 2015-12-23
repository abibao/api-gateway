"use strict";

var Bcrypt = require('bcrypt');
var MD5 = require('md5');

module.exports = function(thinky) {
  
  var type = thinky.type;

  var Model = thinky.createModel("administrators", {
    email: type.string().email().required(),
    password: type.string().required(),
    salt: type.string(),
    createdAt: type.date().required()
  }); 
  
  Model.pre('save', function(next) {
    var user = this;
    user.id = MD5(user.email);
    if (user.salt) return next();
    // only hash the password if it has been modified (or is new)
    //if (!user.isSaved()) return next();
    // generate a salt
    Bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      user.salt = salt;
      // hash the password along with our new salt
      Bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });
  
  /*Model.methods.comparePassword = function(candidatePassword, cb) {
    Bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };*/ 
  
  return Model;
  
};