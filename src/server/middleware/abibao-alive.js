'use strict'

module.exports = function (app) {
  return function (req, res, next) {
    res.send({alive: true})
  }
}
