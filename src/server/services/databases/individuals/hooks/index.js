'use strict'

const auth = require('feathers-authentication').hooks
const hooks = require('feathers-hooks')

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}

exports.after = {
  all: [
    hooks.remove('hashedPassword', 'salt', 'verified')
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
