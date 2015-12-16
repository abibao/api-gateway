"use strict";

exports.get = {
  auth: false,
  tags: ['api', 'test'],
  jsonp: 'callback',
  handler: function(request, reply) {
    reply({test:true});
  }
};

exports.delete = {
  auth: false,
  tags: ['api', 'test'],
  jsonp: 'callback',
  handler: function(request, reply) {
    reply({test:true});
  }
};

exports.post = {
  auth: false,
  tags: ['api', 'test'],
  jsonp: 'callback',
  handler: function(request, reply) {
    reply({payload: request.payload});
  }
};

exports.patch = {
  auth: false,
  tags: ['api', 'test'],
  jsonp: 'callback',
  handler: function(request, reply) {
    reply({payload: request.payload});
  }
};