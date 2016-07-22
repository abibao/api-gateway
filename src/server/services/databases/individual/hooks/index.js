'use strict'

const auth = require('feathers-authentication').hooks
const localHooks = require('./local')

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    localHooks.emailAlreadyExists(),
    localHooks.hasRegisteredEntity(),
    localHooks.createdAt(),
    localHooks.modifiedAt(),
    localHooks.validate()
  ],
  update: [
    localHooks.modifiedAt(),
    localHooks.validate()
  ],
  patch: [
    localHooks.modifiedAt(),
    localHooks.validate()
  ],
  remove: []
}

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    localHooks.individualRegisterCommand()
  ],
  update: [],
  patch: [],
  remove: []
}
