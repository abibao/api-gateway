'use strict'

const sinon = require('sinon')

const Promise = require('bluebird')
const Engine = require('../src-v3/lib/Engine')
const engine = new Engine()

sinon.stub(engine.modules, 'get', function (name) {
  switch (name) {
    case 'thinky':
      return function (options) {
        return {
          createModel: function () {
            return {
              pre: function () {
                return {}
              },
              define: function () {
                return {}
              }
            }
          },
          r: {
            now: function () {
              return this
            }
          },
          type: {
            virtual: function () {
              return this
            },
            required: function () {
              return this
            },
            default: function () {
              return this
            },
            string: function () {
              return this
            },
            date: function () {
              return this
            },
            email: function () {
              return this
            },
            number: function () {
              return this
            },
            integer: function () {
              return this
            },
            min: function () {
              return this
            },
            max: function () {
              return this
            },
            boolean: function () {
              return this
            },
            enum: function () {
              return this
            },
            object: function () {
              return this
            }
          }
        }
      }
    case 'rethinkdbdash':
      return function (options) {
        return {}
      }
    case 'knex':
      return function (options) {
        return {
          schema: {
            createTableIfNotExists: function (db, table) {
              return new Promise((resolve) => {
                resolve()
              })
            }
          }
        }
      }
    default:
      return require(name)
  }
})

module.exports = engine
