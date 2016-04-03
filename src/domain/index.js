"use strict";

var debug = require("debug")("abibao:domain:initializer");
var async = require("async");
var path = require("path");
var dir = require("node-dir");

var nconf = require("nconf");
nconf.argv().env().file({ file: 'nconf-env.json' });

var _ = require("lodash");
var Cryptr = require("cryptr");
var cryptr = new Cryptr(nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"));

var options = {
  host: nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST"),
  port: nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT"),
  db: nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_DB"),
  authKey: nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY")
};
var thinky = require("thinky")(options);

module.exports = {
  
  // injected
  logger: null,
  io: null,
  thinky,
  ThinkyErrors: thinky.Errors,
  Query: thinky.Query,
  r: thinky.r,
  
  ABIBAO_CONST_TOKEN_AUTH_ME: "auth_me",
  ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION: "email_verification",
  ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH: "campaign_publish",
  ABIBAO_CONST_ENTITY_TYPE_NONE: "none",
  ABIBAO_CONST_ENTITY_TYPE_ABIBAO: "abibao",
  ABIBAO_CONST_ENTITY_TYPE_CHARITY: "charity",
  ABIBAO_CONST_ENTITY_TYPE_COMPANY: "company",
  ABIBAO_CONST_USER_SCOPE_ADMINISTRATOR: "administrator",
  ABIBAO_CONST_USER_SCOPE_INDIVIDUAL: "individual",
  
  getIDfromURN(urn) {
    return cryptr.decrypt(_.last(_.split(urn, ":")));
  },
  
  getURNfromID(id, model) {
    return "urn:abibao:database:"+model+":"+cryptr.encrypt(id);
  },
  
  injector(type, callback) {
    var self = this;
    debug("["+type+"]");
    // custom
    dir.readFiles(path.resolve(__dirname, type), 
      {
        recursive: false,
        match: /.js/
      },
      function(err, content, next) {
        if (err) {
          return callback(err, null);
        }  
        next();
      },
      function(err, files) {
        if (err) { 
          return callback(err, null); 
        }
        async.mapSeries(files, function(item, next) {
          var name = path.basename(item, ".js");
          debug(">>> ["+_.upperFirst(name)+"] has just being injected");
          if (type==="models") {
            self[name] = require("./"+type+"/"+name)(self.thinky);
          } else {
            self[name] = require("./"+type+"/"+name);
          }
          next(null, true);
        }, function(error, results) {
          callback(error, results);
        });
      });
  }
  
};