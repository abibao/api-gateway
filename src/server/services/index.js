'use strict'

const administrators = require('./administrators')

module.exports = function () {
  const app = this

  app.configure(administrators)
}
