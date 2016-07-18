'use strict'

const authentication = require('./authentication')
const autologin = require('./domains/autologin')
const entity = require('./databases/entity')
const individual = require('./databases/individual')
const user = require('./memory/user')

module.exports = function () {
  const app = this

  app.configure(authentication)
  app.configure(autologin)
  app.configure(entity)
  app.configure(individual)
  app.configure(user)
}
