'use strict'

var Promise = require('bluebird')
var _ = require('lodash')

var r = require('./../../../connections/thinky').r
var knex = require('./../../../connections/knex')()

var validate = function (individual) {
  return new Promise(function (resolve, reject) {
    if (!individual.email) { reject(new Error('email is mandatory')) }
    if (!individual.urn) { reject(new Error('urn is mandatory')) }
    if (!individual.urnCharity) { reject(new Error('urnCharity is mandatory')) }
    resolve()
  })
}

module.exports = function (individual) {
  return new Promise(function (resolve, reject) {
    Promise.props({
      validate: validate(individual)
    })
    .then((result) => {
      global.ABIBAO.debuggers.domain('[%s] step 1: check surveys base answers', individual.email)
      individual.id = global.ABIBAO.services.domain.getIDfromURN(individual.urn)
      individual.charity = global.ABIBAO.services.domain.getIDfromURN(individual.urnCharity)
      individual.hasRegisteredEntity = global.ABIBAO.services.domain.getIDfromURN(individual.urnRegisteredEntity)
      r.table('surveys')
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
          'ABIBAO_ANSWER_FONDAMENTAL_GENDER'
        )
        .then(function (item) {
          var props = Object.keys(item)
          var promises = {
            'CHARITY': r.table('entities').get(individual.charity)('name'),
            'HAS_REGISTERED_ENTITY': r.table('entities').get(individual.hasRegisteredEntity)('name')
          }
          _.map(props, function (prop) {
            switch (prop) {
              case 'ABIBAO_ANSWER_FONDAMENTAL_AGE':
                promises[prop] = parseInt(item.ABIBAO_ANSWER_FONDAMENTAL_AGE)
                break
              case 'ABIBAO_ANSWER_FONDAMENTAL_CSP':
                promises[prop] = r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_CSP)('text')
                break
              case 'ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT':
                promises[prop] = r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT)('text')
                break
              case 'ABIBAO_ANSWER_FONDAMENTAL_GENDER':
                promises[prop] = r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_GENDER)('text')
                break
              default:
            }
          })
          global.ABIBAO.debuggers.domain('[%s] step 2: create the data to be inserted in mysql analytics', individual.email)
          Promise.props(promises)
            .then((result) => {
              var data = {
                email: individual.email || null,
                charity: result.CHARITY || null,
                registeredCharity: result.HAS_REGISTERED_ENTITY || null,
                age: result.ABIBAO_ANSWER_FONDAMENTAL_AGE || null,
                csp: result.ABIBAO_ANSWER_FONDAMENTAL_CSP || null,
                department: result.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT || null,
                gender: result.ABIBAO_ANSWER_FONDAMENTAL_GENDER || null,
                createdAt: new Date(individual.createdAt)
              }
              global.ABIBAO.debuggers.domain('[%s] step 3: replace/insert those data in mysql analytics, data=%o', individual.email, data)
              knex('users').where('email', data.email).delete()
                .then(() => {
                  return knex('users').insert(data)
                })
                .then(function () {
                  resolve(data)
                })
                .catch(reject)
            })
            .catch(reject)
        })
    })
    .catch(reject)
  })
}
