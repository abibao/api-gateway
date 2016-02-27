"use strict";

var crypto = require("crypto");
var Cryptr = require("cryptr"),
cryptr = new Cryptr(process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var IndividualModel = thinky.createModel("individuals", {
    // virtuals
    urn: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : "urn:abibao:individual:"+cryptr.encrypt(this.id);
    }),
    // fields
    email: type.string().email().required(),
    scope: type.string().default("individual"),
    verified: type.boolean().default(false),
    // linked
    entity: type.string(),
    // calculated
    hashedPassword: type.string(),
    salt: type.string(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  IndividualModel.pre("save", function(next) {
    var data = this;
    data.modifiedAt = r.now();
    // salt exists ?
    if (data.salt) return next();
    data.salt = this.makeSalt();
    data.hashedPassword = data.encryptPassword(data.password);
    delete data.password;
    next();
  });
  
  IndividualModel.define("authenticate", function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  });
  
  IndividualModel.define("makeSalt", function() {
    return crypto.randomBytes(16).toString("base64");
  });
  
  IndividualModel.define("encryptPassword", function(password) {
    if (!password || !this.salt) return "";
    var salt = new Buffer(this.salt, "base64");
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString("base64");
  });
  
  return IndividualModel;
  
};