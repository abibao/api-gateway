'use strict'

var Promise = require('bluebird')

module.exports = function (individual) {
  return new Promise(function (resolve, reject) {
    // construct user to insert
    individual.id = global.ABIBAO.services.domain.getIDfromURN(individual.urn)
    individual.charity = global.ABIBAO.services.domain.getIDfromURN(individual.urnCharity)
    global.ABIBAO.services.domain.thinky.r.table('surveys')
      .filter({individual: individual.id})
      .map(function (item) {
        return item('answers')
      })
      .forEach(function (item) {
        return item
      })
      .pluck(
        'ABIBAO_ANSWER_FONDAMENTAL_AGE',
        'ABIBAO_ANSWER_FONDAMENTAL_CSP',
        'ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT',
        'ABIBAO_ANSWER_FONDAMENTAL_GENDER')
      .then(function (item) {
        return Promise.all([
          global.ABIBAO.services.domain.thinky.r.table('entities').get(individual.charity),
          global.ABIBAO.services.domain.thinky.r.table('entities').get(individual.hasRegisteredEntity),
          global.ABIBAO.services.domain.thinky.r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_CSP),
          global.ABIBAO.services.domain.thinky.r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT),
          global.ABIBAO.services.domain.thinky.r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_GENDER),
          global.ABIBAO.services.domain.thinky.r.now()
        ])
          .then(function (result) {
            var data = {
              email: individual.email || null,
              charity: result[0].name || null,
              registeredCharity: result[1].name || null,
              age: item.ABIBAO_ANSWER_FONDAMENTAL_AGE || null,
              csp: result[2].text || null,
              department: result[3].text || null,
              gender: result[4].text || null,
              createdAt: individual.createdAt,
              modifiedAt: result[5]
            }
            // consolidate data
            if (data.age !== null) {
              data.age = parseInt(data.age)
            }
            // insert/update in mysql
            return global.ABIBAO.services.domain.knex('users')
              .where('email', data.email)
              .delete()
              .then(function () {
                return global.ABIBAO.services.domain.knex('users').insert(data)
              })
              .then(function (inserted) {
                global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_USER', inserted)
                resolve()
              })
          })
      })
      .catch(reject)
  })
}
