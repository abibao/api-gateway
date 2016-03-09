"use strict";

var debug = require("debug")("abibao:domain:initializer");

var Promise = require("bluebird");
var async = require("async");
var _ = require("lodash");
var path = require("path");
var dir = require("node-dir");

var nconf = require("nconf");
nconf.argv().env();

var Cryptr = require("cryptr");
var cryptr = new Cryptr(nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"));

var options = {
  host: nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST"),
  port: nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT"),
  db: nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_DB"),
  authKey: nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY"),
  silent: true
};
var thinky = require("thinky")(options);

var internal = {};

internal.domain = {
  
  // injected
  logger: null,
  io: null,
  thinky
  ThinkyErrors: thinky.Errors,
  Query: thinky.Query,
  r: thinky.r,
  
  ABIBAO_CONST_TOKEN_AUTH_ME: "auth_me",
  ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION: "email_verification",
  ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH: "campaign_publish",
  ABIBAO_CONST_ENTITY_TYPE_CHARITY: "charity",
  ABIBAO_CONST_ENTITY_TYPE_COMPANY: "company",
  ABIBAO_CONST_USER_SCOPE_ADMINISTRATOR: "administrator",
  ABIBAO_CONST_USER_SCOPE_INDIVIDUAL: "individual",
  
  getIDfromURN(urn) {
    return cryptr.decrypt(_.last(_.split(urn, ":")));
  },
  
  getURNfromID(id, model) {
    return "urn:abibao:database:"+model+":"+cryptr.encrypt(id);
  }
  
};

module.exports.singleton = internal.domain;

module.exports.start = function() {
  return new Promise(function(resolve, reject) {
    var items = ["models", "queries/system", "commands/system", "events/system", "listeners/system", "queries", "commands", "events", "listeners"];
    debug(items);
    async.mapSeries(items, function(type, nextA) {
      debug("["+type+"]");
      dir.readFiles(path.resolve(__dirname, type), {
          recursive: false,
          match: /.js/
        }, function(err, content, nextB) {
          if (err) { return reject(err); }  
          nextB();
        }, function(err, files) {
          if (err) { return reject(err); } 
          async.mapSeries(files, function(item, nextC) {
            var name = path.basename(item, ".js");
            debug(">>> ["+_.upperFirst(name)+"] has just being injected");
            if (type==="models") {
              internal.domain[name] = require("./"+type+"/"+name)(internal.domain.thinky);
            } else {
              internal.domain[name] = require("./"+type+"/"+name);
            }
            nextC();
          }, function() {
            nextA();
          });
        });
    }, function() {
      resolve();
    });
  });
};