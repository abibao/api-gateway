'use strict'

const hooks = require('./hooks')

class Service {
  setup (app) {
    this.app = app
  }
  find (params) {
    return global.ABIBAO.services.domain.execute('query', 'findSurveysQuery', params)
  }
  get (id, params) {
    params.query.urn = id
    return global.ABIBAO.services.domain.execute('query', 'getSurveyDetailsQuery', params)
  }
  create (data) {}
  update (id, data) {}
  patch (id, data) {}
  remove (id) {}
}

module.exports = function () {
  const app = this
  app.use('v1/surveys', new Service())
  const service = app.service('v1/surveys')
  service.before(hooks.before)
  service.after(hooks.after)
}
