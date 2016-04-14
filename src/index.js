"use strict";

var debug = require("debug")("abibao:initializers");
debug("start");

// load configurations
var nconf = require("nconf");
nconf.argv().env().file({ file: 'nconf-env.json' });

require("newrelic");

// declare services
var Services = require("./services");

// manage instances
var server = Services.server();
var domain = Services.domain();

Services.startDomain(function(err) {
  if (err) { return debug(err); }
  Services.startServer(function(err) {
    if (err) { return debug(err); }
    // start listeners
    domain.administratorsListenerChanged();
    domain.campaignsItemsListenerChanged();
    domain.campaignsItemsChoicesListenerChanged();
    domain.campaignsListenerChanged();
    domain.entitiesListenerChanged();
    domain.individualsListenerChanged();
    domain.surveysListenerChanged();
    // inject domain in server
    server.domain = domain;
    debug("end");
  });
});