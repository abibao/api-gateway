'use strict'

const Promise = require('bluebird')

class Service {
  setup (app) {
    this.app = app
  }
  get (urn) {
    const app = this.app
    return new Promise(function (resolve, reject) {
      global.ABIBAO.services.domain.execute('query', 'getSurveyDetailsControlIndividualQuery', urn)
        .then(function (result) {
          resolve(result)
        })
        .catch(reject)
    })
  }
}

module.exports = function () {
  const app = this
  app.use('v1/auth/survey', new Service())
  const service = app.service('v1/auth/survey')
}
