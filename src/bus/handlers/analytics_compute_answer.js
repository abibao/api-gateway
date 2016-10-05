'use strict'

var Promise = require('bluebird')

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    // construct data to insert
    global.ABIBAO.services.domain.thinky.r.table('surveys')
      .get(message.survey)
      .merge(function (item) {
        return {
          data: {
            email: global.ABIBAO.services.domain.thinky.r.table('individuals').get(item('individual'))('email'),
            'charity_id': item('charity'),
            'charity_name': global.ABIBAO.services.domain.thinky.r.table('entities').get(item('charity'))('name'),
            'campaign_id': item('campaign'),
            'campaign_name': global.ABIBAO.services.domain.thinky.r.table('campaigns').get(item('campaign'))('name'),
            question: message.label,
            answer: message.answer,
            'answer_text': (message.isURN === true) ? global.ABIBAO.services.domain.thinky.r.table('campaigns_items_choices').get(message.answer)('text') : message.answer
          }
        }
      })
      .then(function (result) {
        // now insert data in MySQL
        return global.ABIBAO.services.domain.knex('answers')
          .where('email', result.data.email)
          .where('campaign_id', result.data['campaign_id'])
          .where('question', result.data.question)
          .delete()
          .then(function () {
            return global.ABIBAO.services.domain.knex('answers').insert(result.data)
          })
          .then(function () {
            global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_ANSWER', result.data.email)
            // update user
            global.ABIBAO.services.domain.thinky.r.table('individuals').get(result.data.email)
            .then(function (individual) {
              global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_USER, individual)
            })
            resolve()
          })
      })
      .catch(reject)
  })
}
