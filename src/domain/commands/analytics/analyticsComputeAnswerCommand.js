'use strict'

var Promise = require('bluebird')

var r = require('./../../../connections/thinky').r
var knex = require('./../../../connections/knex')()

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_ANALYTICS')
    // construct data to insert
    r.table('surveys')
      .get(message.survey)
      .merge(function (item) {
        return {
          data: {
            email: r.table('individuals').get(item('individual'))('email'),
            'charity_id': item('charity'),
            'charity_name': r.table('entities').get(item('charity'))('name'),
            'campaign_id': item('campaign'),
            'campaign_name': r.table('campaigns').get(item('campaign'))('name'),
            question: message.label,
            answer: message.answer,
            'answer_text': (message.isURN === true) ? r.table('campaigns_items_choices').get(message.answer)('text') : message.answer
          }
        }
      })
      .then(function (result) {
        // now insert data in MySQL
        return knex(database + '.answers')
          .where('email', result.data.email)
          .where('campaign_id', result.data['campaign_id'])
          .where('question', result.data.question)
          .delete()
          .then(function () {
            global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_ANSWER', result.data)
            return knex(database + '.answers').insert(result.data)
          })
          .then(function () {
            // update user
            global.ABIBAO.services.domain.execute('query', 'individualFilterQuery', {email: result.data.email})
            .then(function (individuals) {
              var individual = individuals[0]
              global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_USER, individual)
            })
            resolve()
          })
      })
      .catch(reject)
  })
}
