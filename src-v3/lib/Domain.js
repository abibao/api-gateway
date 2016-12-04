'use strict'

// debugs
const _debug = require('debug')('abibao:domain')

// libraries
const Promise = require('bluebird')
const uuid = require('node-uuid')
const path = require('path')
const glob = require('glob')
const async = require('async')
const _ = require('lodash')
const Cryptr = require('cryptr')

class Domain {
  constructor (engine) {
    this.type = 'domain'
    this.name = 'domain'
    this.debug = _debug
    this.error = engine.error
    this.databases = engine.databases
    this.nconf = engine.nconf
    this.cryptr = new Cryptr(this.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  }
  getIDfromURN (urn) {
    return this.cryptr.decrypt(_.last(_.split(urn, ':')))
  }
  getURNfromID (id, model) {
    return 'urn:abibao:database:' + model + ':' + this.cryptr.encrypt(id)
  }
}

Domain.prototype.execute = function (type, promise, params) {
  return new Promise((resolve, reject) => {
    const starttime = new Date()
    let data = {
      uuid: uuid.v1(),
      environnement: this.nconf.get('ABIBAO_API_GATEWAY_ENV'),
      type,
      promise
    }
    const Action = this[promise]
    const action = new Action(this)
    action.handler(params)
      .then((result) => {
        data.exectime = new Date() - starttime
        data.result = result
        // global.ABIBAO.logger.info(data)
        this.debug('[%s] %s %s %s ms', data.uuid, type, promise, data.exectime)
        resolve(data)
      })
      .catch((error) => {
        data.exectime = new Date() - starttime
        data.error = error
        // global.ABIBAO.logger.error(data)
        this.error('[%s] %s %s %o', data.uuid, type, promise, error)
        reject(data)
      })
  })
}

Domain.prototype.initialize = function () {
  return new Promise((resolve, reject) => {
    this.debug('start initializing')
    Promise.all([
      this.injector('../domain/models/mysql'),
      this.injector('../domain/models/r'),
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
        case '../domain/models/r':
          let ModelRethink = require(file)
          this[name] = new ModelRethink(this)
          break
        case '../domain/commands':
          this[name] = require(file)
          break
        case '../domain/queries':
          this[name] = require(file)
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
