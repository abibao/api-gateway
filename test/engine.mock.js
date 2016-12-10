'use strict'

const path = require('path')
const fse = require('fs-extra')
const _ = require('lodash')

const Promise = require('bluebird')
const Engine = require('../src-v3/lib/Engine')
let engine = new Engine()

engine.modules.get = (name) => {
  switch (name) {
    case 'rethinkdbdash':
      return (options) => {
        return {
          dbList: function () {
            this.result = 'dbList'
            return this
          },
          contains: function () {
            return this
          },
          dbCreate: function () {
            this.result = 'dbCreate'
            return this
          },
          tableCreate: function () {
            this.result = 'tableCreate'
            return this
          },
          tableList: function () {
            this.result = 'tableList'
            return this
          },
          db: function (name) {
            this.result = null
            this.error = null
            this._db = name
            return this
          },
          table: function (name) {
            this._table = name
            return this
          },
          get: function (urn) {
            const dirpath = path.resolve(__dirname, 'databases/r', this._db, this._table)
            fse.ensureDirSync(dirpath)
            const filepath = path.resolve(dirpath, urn + '.json')
            this.result = fse.readJsonSync(filepath) || {}
            return this
          },
          filter: function (params) {
            const dirpath = path.resolve(__dirname, 'databases/r', this._db, this._table)
            fse.ensureDirSync(dirpath)
            this.collection = []
            _.map(fse.readdirSync(dirpath), (filename) => {
              let filepath = path.resolve(dirpath, filename)
              this.collection.push(fse.readJsonSync(filepath))
            })
            let filter = _.filter(this.collection, params) || []
            if (_.isArray(filter)) {
              this.result = filter
            } else {
              this.result = []
              this.result.push(filter)
            }
            return this
          },
          insert (data) {
            const dirpath = path.resolve(__dirname, 'databases/r', this._db, this._table)
            fse.ensureDirSync(dirpath)
            const filepath = path.resolve(dirpath, data.id + '.json')
            fse.writeJsonSync(filepath, data)
            this.result = data
            return this
          },
          run () {
            return new Promise((resolve, reject) => {
              if (this.result) {
                resolve(this.result)
              } else if (this.error) {
                reject(this.error)
              } else {
                reject(new Error('TESTS_DOWN'))
              }
            })
          },
          now: function () {
            return this
          }
        }
      }
    case 'knex':
      return function (options) {
        return {
          raw: function () {
            return this
          },
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
}

module.exports = engine
