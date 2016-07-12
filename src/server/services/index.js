'use strict'

const authentication = require('./authentication')
const administrator = require('./administrator')

module.exports = function () {
  const app = this

  app.configure(authentication)
  app.configure(administrator)
}
