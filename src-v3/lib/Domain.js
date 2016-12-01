'use strict'

class Domain {
  constructor (engine) {
    this.type = 'domain'
    this.name = 'domain'
    this.modules = engine.modules
    this.debug = this.modules.get('debug')('abibao:' + this.type)
    this.error = engine.error
    this.databases = engine.databases
    this.nconf = engine.nconf
  }
}

Domain.prototype.execute = function (type, promise, params) {
  const uuid = this.modules.get('node-uuid')
  return new Promise((resolve, reject) => {
    var starttime = new Date()
    var data = {
      uuid: uuid.v1(),
      environnement: this.nconf.get('ABIBAO_API_GATEWAY_ENV'),
      type,
      promise
    }
    this[promise].handler(params)
      .then((result) => {
        data.exectime = new Date() - starttime
        // global.ABIBAO.logger.info(data)
        this.debug('[%s] %s %s %s ms', data.uuid, type, promise, data.exectime)
        resolve(result)
      })
      .catch((error) => {
        data.exectime = new Date() - starttime
        data.error = error
        // global.ABIBAO.logger.error(data)
        this.error('[%s] %s %s %o', data.uuid, type, promise, error)
        reject(error)
      })
  })
}

Domain.prototype.initialize = function () {
  const Promise = this.modules.get('bluebird')
  return new Promise((resolve, reject) => {
    this.debug('start initializing')
    Promise.all([
      this.injector('../domain/models/mysql'),
      this.injector('../domain/models/rethinkdb'),
      this.injector('../domain/commands'),
      this.injector('../domain/queries')
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
        case '../domain/commands':
          let Command = require(file)
          this[name] = new Command(this)
          break
        case '../domain/queries':
          let Query = require(file)
          this[name] = new Query(this)
          break
        default:
          this[name] = require(file)
      }
      next(null, true)
    }, (error, result) => {
      this.debug('injector callback error=%s with %s items', !!error, result.length)
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

module.exports = Domain
