'use strict'

module.exports = function (message) {
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
      global.ABIBAO.debuggers.bus(result.data)
      // now insert data in MySQL
      global.ABIBAO.services.domain.knex('answers')
        .where('email', result.data.email)
        .where('campaign_id', result.data['campaign_id'])
        .where('question', result.data.question)
        .delete()
        .then(function () {
          return global.ABIBAO.services.domain.knex('answers').insert(result.data)
            .then(function (inserted) {
              global.ABIBAO.debuggers.bus(inserted)
            })
        })
        .catch(function (error) {
          global.ABIBAO.debuggers.error(error)
        })
    })
}
