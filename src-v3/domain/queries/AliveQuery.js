'use strict'

// libraries
const Promise = require('bluebird')

class AliveQuery {
  constructor (domain) {
    this.type = 'query'
    this.name = 'alive-query'
    this.nconf = domain.nconf
  }
  handler () {
    return new Promise((resolve) => {
      resolve({alive: true})
    })
  }
}

module.exports = AliveQuery
