'use strict'

// load environnement configuration
var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

var options = {
  client: 'mysql',
  connection: {
    host: config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_HOST'),
    port: config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PORT'),
    user: config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PASSWORD')
  },
  debug: false
}
var knex = require('knex')(options)
var database = config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')

var AnswerModel = require('../src/domain/models/mysql/AnswerModel')
var UserModel = require('../src/domain/models/mysql/UserModel')
var VoteSMFModel = require('../src/domain/models/mysql/VoteSMFModel')

describe('mysql structure', function () {
  it('should create schema if not exists', function (done) {
    knex.raw('CREATE SCHEMA IF NOT EXISTS `' + database + '` DEFAULT CHARACTER SET utf8;')
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create table answers if not exists', function (done) {
    AnswerModel(knex, database)
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create table users if not exists', function (done) {
    UserModel(knex, database)
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create table smf_votes if not exists', function (done) {
    VoteSMFModel(knex, database)
      .then(() => {
        done()
      }).catch(done)
  })
})
