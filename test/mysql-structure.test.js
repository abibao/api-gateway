'use strict'

var knex = require('../src/connections/knex')()

describe('mysql structure', function () {
  it('should create database test.answers', function (done) {
    var AnswerModel = require('../src/domain/models/mysql/AnswerModel')(knex)
    AnswerModel.then(() => {
      done()
    }).catch(done)
  })
  it('should create database test.bounces', function (done) {
    var SendgridBounceModel = require('../src/domain/models/mysql/SendgridBounceModel')(knex)
    SendgridBounceModel.then(() => {
      done()
    }).catch(done)
  })
  it('should create database test.users', function (done) {
    var UserModel = require('../src/domain/models/mysql/UserModel')(knex)
    UserModel.then(() => {
      done()
    }).catch(done)
  })
  it('should create database test.smf_votes', function (done) {
    var VoteSMFModel = require('../src/domain/models/mysql/VoteSMFModel')(knex)
    VoteSMFModel.then(() => {
      done()
    }).catch(done)
  })
})
