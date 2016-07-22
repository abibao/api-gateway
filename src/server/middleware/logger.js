'use strict'

const winston = require('winston')

module.exports = function (app) {
  app.logger = winston

  return function (error, req, res, next) {
    if (error) {
      global.ABIBAO.debuggers.server('Route %s - ERROR', req.url)
    } else {
      global.ABIBAO.debuggers.server('Route %s', req.url)
    }
    next(error)
  }
}
