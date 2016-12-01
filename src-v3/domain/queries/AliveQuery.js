'use strict'

class AliveQuery {
  constructor (domain) {
    this.type = 'query'
    this.name = 'alive-query'
    this.modules = domain.modules
    this.debug = this.modules.get('debug')('abibao:' + this.type)
    this.nconf = domain.nconf
  }
}

AliveQuery.prototype.handler = function (payload) {
  const Promise = this.modules.get('bluebird')
  return new Promise((resolve, reject) => {
    resolve({alive: true})
  })
}

module.exports = AliveQuery
