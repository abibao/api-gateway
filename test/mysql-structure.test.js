'use strict'

// load environnement configuration
var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

var AnswerModel = require('../src/domain/models/mysql/AnswerModel')
var UserModel = require('../src/domain/models/mysql/UserModel')
var VoteSMFModel = require('../src/domain/models/mysql/VoteSMFModel')

var knex = null

describe('mysql structure', function () {
  it('should create schema if not exists', function (done) {
<<<<<<< HEAD
    require('./../src/connections/knex')()
      .then((result) => {
        knex = result
=======
    knex.raw('CREATE SCHEMA IF NOT EXISTS `' + database + '` DEFAULT CHARACTER SET utf8;')
      .then(() => {
>>>>>>> 4aee95594d225147776172551af83a9827f0c818
        done()
      }).catch(done)
  })
  it('should create table answers if not exists', function (done) {
    AnswerModel(knex)
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create table users if not exists', function (done) {
    UserModel(knex)
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create table smf_votes if not exists', function (done) {
    VoteSMFModel(knex)
      .then(() => {
        done()
      }).catch(done)
  })
})
