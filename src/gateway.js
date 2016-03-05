"use strict";

var debug = require("debug")("abibao:gateway:initializers");

var _ = require("lodash");

var nconf = require("nconf");
nconf.argv().env();

if (nconf.get("ABIBAO_API_GATEWAY_PRODUCTION_ENABLE")) {
  // production
  require("newrelic");
} else {
  // development
  require("dotenv").config({silent:false});
}

debug("<<START>>");

debug("domain initializer");
var domain = require("./domain/indexNew");
var domainPromisify = domain.start().then(function() {
  debug("domain is initialized");
});

debug("server initializer");
var server = require("./server/indexNew");
var serverPromisify = server.start().then(function() {
  debug("server is initialized");
});

Promise.all([domainPromisify, serverPromisify])
  .then(function() {
    debug("<<END>>");
    // set refs
    domain.singleton.server = server.singleton;
    server.singleton.domain = domain.singleton;
    // start
    server.singleton.start(function(err) {
      if (err) { return debug(err); }
      _.forEach(server.singleton.plugins.blipp.text().split("\n"), function(item) {
        if (item!=="") { debug(item.trim()); }
      });
    });
  })
  .catch(function(error) {
    debug(error);
    process.exit(-1);
  });

