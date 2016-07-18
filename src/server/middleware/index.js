'use strict'

const abibaoAlive = require('./abibao-alive')
const handler = require('feathers-errors/handler')
const notFound = require('./not-found-handler')
const logger = require('./logger')

module.exports = function () {
  const app = this

  app.get('/alive', abibaoAlive(app))

  app.use(notFound())
  app.use(logger(app))
  app.use(handler())
}
