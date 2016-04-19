'use strict'

// Promise
var Promise = require('bluebird'),
  promisifyAll = Promise.promisifyAll

// declare internal libraries
var fs = promisifyAll(require('fs')),
  readFile = fs.readFileAsync,
  writeFile = fs.writeFileAsync

// declare external libraries
var Mustache = require('mustache'),
  render = Mustache.render

// declare project libraries
var notice = require('./../console').notice

module.exports = function (template, destination, filename, data) {
  return new Promise(function (resolve, reject) {
    readFile(template, 'utf8')
      .then(function (content) {
        var result = render(content, data)
        writeFile(destination + '/' + filename, result, 'utf8')
          .then(function () {
            notice('[x] mustache created', ' ' + filename)
            resolve()
          })
          .catch(function (e) {
            reject(e)
          })
      })
      .catch(function (e) {
        reject(e)
      })
  })
}
