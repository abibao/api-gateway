'use strict'

var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function (payload) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    if (_.isUndefined(payload.credentials.action)) { return reject(new Error('Action is undefined')) }
    if (payload.credentials.action !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME) { return reject(new Error('Action is unauthorized')) }
    self.execute('query', 'entityReadQuery', payload.charity).then(function (charity) {
      if (charity.type !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_CHARITY) { return reject(new Error('This is not a Charity')) }
      return self.execute('query', 'individualReadQuery', payload.credentials.urn).then(function (individual) {
        if (self.getIDfromURN(individual.urnRegisteredSurvey) !== 'none') {
          return self.execute('command', 'individualCreateSurveyCommand', {
            campaign: individual.urnRegisteredSurvey,
            individual: individual.urn,
            charity: payload.charity
          }).then(() => {
            return individual
          })
        } else {
          return individual
        }
      })
      .then((individual) => {
        return self.execute('command', 'individualUpdateCommand', {
          urn: payload.credentials.urn,
          charity: self.getIDfromURN(charity.urn),
          hasRegisteredEntity: 'none'
        }).then(function (individual) {
          resolve(individual)
          global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_USER, individual)
        })
      })
    })
    .catch(function (error) {
      reject(error)
    })
  })
}
