'use strict'

var Promise = require('bluebird')

module.exports = function (individual) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_USER 1) email=', individual.email)
    var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
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
        var p = new Promise(function (resolve) {
          resolve({text: null})
        })
        var promises = []
        promises.push(global.ABIBAO.services.domain.thinky.r.table('entities').get(individual.charity))
        promises.push(global.ABIBAO.services.domain.thinky.r.table('entities').get(individual.hasRegisteredEntity))
        if (item.ABIBAO_ANSWER_FONDAMENTAL_CSP) {
          promises.push(global.ABIBAO.services.domain.thinky.r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_CSP))
        } else {
          promises.push(p)
        }
        if (item.ABIBAO_ANSWER_FONDAMENTAL_CSP) {
          promises.push(global.ABIBAO.services.domain.thinky.r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_CSP))
        } else {
          promises.push(p)
        }
        if (item.ABIBAO_ANSWER_FONDAMENTAL_GENDER) {
          promises.push(global.ABIBAO.services.domain.thinky.r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_GENDER))
        } else {
          promises.push(p)
        }
        return Promise.all(promises)
          .then(function (result) {
            var data = {
              email: individual.email || null,
              charity: result[0].name || null,
              registeredCharity: result[1].name || null,
              age: item.ABIBAO_ANSWER_FONDAMENTAL_AGE || null,
              csp: result[2].text || null,
              department: result[3].text || null,
              gender: result[4].text || null,
              createdAt: new Date(individual.createdAt)
            }
            // consolidate data
            if (data.age !== null) {
              data.age = parseInt(data.age)
            }
            global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_USER 2) email=', individual.email)
            // insert/update in mysql
            return global.ABIBAO.services.domain.knex(database + '.users')
              .where('email', data.email)
              .delete()
              .then(function () {
                return global.ABIBAO.services.domain.knex(database + '.users').insert(data)
              })
              .then(function (inserted) {
                global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_USER 3) email=', individual.email)
                resolve()
              })
          })
      })
      .catch(function (error) {
        global.ABIBAO.debuggers.error(error)
        reject(error)
      })
  })
}
