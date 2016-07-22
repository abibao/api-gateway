'use strict'

const auth = require('feathers-authentication').hooks
const validate = require('./validate')

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    validate()
  ],
  update: [
    validate()
  ],
  patch: [
    validate()
  ],
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
