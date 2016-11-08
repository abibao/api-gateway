'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var AnswerModel = require('../src/domain/models/mysql/AnswerModel')
var UserModel = require('../src/domain/models/mysql/UserModel')
var VoteSMFModel = require('../src/domain/models/mysql/VoteSMFModel')
var SendgridBounceModel = require('../src/domain/models/mysql/SendgridBounceModel')

describe('mysql structure', function () {
  it('should create database analytics', function (done) {
    var database = nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
    var knex = require('../src/connections/knex')('EMPTY')
    knex.raw('CREATE SCHEMA IF NOT EXISTS `' + database + '` DEFAULT CHARACTER SET utf8;')
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create table analytics.answers if not exists', function (done) {
    AnswerModel()
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create table analytics.users if not exists', function (done) {
    UserModel()
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create table analytics.smf_votes if not exists', function (done) {
    VoteSMFModel()
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create database sendgrid', function (done) {
    var database = 'sendgrid'
    var knex = require('../src/connections/knex')('EMPTY')
    knex.raw('CREATE SCHEMA IF NOT EXISTS `' + database + '` DEFAULT CHARACTER SET utf8;')
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create table sendgrid.bounces if not exists', function (done) {
    SendgridBounceModel()
      .then(() => {
        done()
      }).catch(done)
  })
})
