'use strict'

class Domain {
  constructor (engine) {
    this.type = 'Domain'
    this.name = 'domain'
    this.modules = engine.modules
    this.debug = this.modules.get('debug')('abibao:' + this.name)
    this.databases = engine.databases
    this.nconf = engine.nconf
  }
  initialize () {
    const Promise = this.modules.get('bluebird')
    return new Promise((resolve, reject) => {
      Promise.all([
        this.injector('../domain/models/mysql'),
        this.injector('../domain/models/rethinkdb')
      ])
      .then(() => {
        return Promise.all([
          this.AnswerModel(this),
          this.UserModel(this),
          this.VoteSMFModel(this),
          this.SendgridBounceModel(this)
        ])
      })
      .then(resolve)
      .catch(reject)
    })
  }
}

Domain.prototype.injector = function (type) {
  return new Promise((resolve, reject) => {
    const path = this.modules.get('path')
    const glob = this.modules.get('glob')
    const async = this.modules.get('async')
    const _ = this.modules.get('lodash')
    const patternPath = path.resolve(__dirname, type) + '/**/*.js'
    const patternFiles = glob.sync(patternPath, {
      nodir: true,
      dot: true,
      ignore: ['index.js']
    })
    this.debug('inject from %s with %s files', patternPath, patternFiles.length)
    async.mapSeries(patternFiles, (file, next) => {
      const name = path.basename(file, '.js')
      this.debug('>>> [' + _.upperFirst(_.camelCase(name)) + '] has just being injected')
      switch (type) {
        case '../domain/models/rethinkdb':
          this[name] = require(file)(this)
          break
        default:
          this[name] = require(file)
      }
      next(null, true)
    }, (error, result) => {
      this.debug('injector callback %o %o', error, result)
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

module.exports = Domain
