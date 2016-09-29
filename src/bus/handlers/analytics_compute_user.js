'use strict'

module.exports = function (individual, callback) {
  // construct user to insert
  individual.id = global.ABIBAO.services.domain.getIDfromURN(individual.urn)
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
    .then(function (result) {
      console.log('BUS_EVENT_ANALYTICS_COMPUTE_USER', result)
      // callback used for tests
      if (callback) { callback() }
    })
}
/** console.log(result)
var data = {
  email: individual.email || null,
  charity: individual.charity || null,
  registeredCharity: individual.hasRegisteredEntity || null,
  age: result.ABIBAO_ANSWER_FONDAMENTAL_AGE || null,
  csp: result.ABIBAO_ANSWER_FONDAMENTAL_CSP || null,
  department: result.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT || null,
  gender: result.ABIBAO_ANSWER_FONDAMENTAL_GENDER || null,
  createdAt: individual.createdAt,
  modifiedAt: individual.modifiedAt
}
console.log(data)
global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_USER %o', data) **/
