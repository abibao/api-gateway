'use strict'

class CacheModules {
  constructor () {
    this.type = 'CacheModules'
    this.name = 'cache-modules'
    this._cache = {}
  }
  get (moduleName) {
    var mod = this._cache[moduleName]
    if (!mod) {
      try {
        mod = require(moduleName)
        this._cache[moduleName] = mod
        return mod
      } catch (e) {
        return {} // cache the fact we have an error on require module
      }
    }
    return mod
  }
}

module.exports = new CacheModules()
