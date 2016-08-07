'use strict'

const auth = require('feathers-authentication').hooks
const hooks = require('feathers-hooks')
const informations = require('./informations')

// hooks.disable('external')
exports.before = {
  all: [
    hooks.disable('external')
  ],
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
  get: [
    informations()
  ],
  create: [],
  update: [],
  patch: [],
  remove: []
}
