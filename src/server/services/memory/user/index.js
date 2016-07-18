'use strict'

const hooks = require('./hooks')
const memory = require('feathers-memory')

module.exports = function () {
  const app = this

  app.use('users', memory())

  const Service = app.service('users')
  Service.before(hooks.before)
  Service.after(hooks.after)
}
