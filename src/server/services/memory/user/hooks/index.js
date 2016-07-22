'use strict'

var auth = require('feathers-authentication').hooks

// hooks.disable('external')
exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.hashPassword()
  ],
  update: [],
  patch: [],
  remove: []
}

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
