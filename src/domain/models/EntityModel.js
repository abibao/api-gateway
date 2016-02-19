"use strict";

var Cryptr = require("cryptr"),
cryptr = new Cryptr(process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var EntityModel = thinky.createModel("entities", {
    // virtuals
    urn: type.virtual().default(function() {
      return ( this.id===undefined)  ? null : 'urn:abibao:entity:'+cryptr.encrypt(this.id);
    }),
    // fields
    name: type.string().required(),
    contact: type.string().email().required(),
    type: type.string().enum(['charity', 'company']).required(),
    icon: type.string().default('images/icons/default.png'),
    avatar: type.string().default('images/avatars/default.png'),
    picture: type.string().default('images/pictures/default.png'),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  EntityModel.pre('save', function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return EntityModel;
  
};