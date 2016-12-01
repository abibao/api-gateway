'use strict'

class NodeModules {
  constructor () {
    this.type = 'NodeModules'
    this.name = 'node-modules'
    this._cache = {}
    this.debug = require('debug')('abibao:' + this.name)
  }
  get (moduleName) {
    let mod = this._cache[moduleName]
    if (!mod) {
      try {
        mod = require(moduleName)
        this._cache[moduleName] = mod
        this.debug('module %s added to cache', moduleName)
        return mod
      } catch (e) {
        return {} // cache the fact we have an error on require module
      }
    }
    return mod
  }
}

module.exports = new NodeModules()
