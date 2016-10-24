'use strict'

// load environnement configuration
var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

var chai = require('chai')
var expect = chai.expect

var engine = require('../src/engine')

var options = {
  client: 'mysql',
  connection: {
    host: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_HOST'),
    port: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PORT'),
    user: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PASSWORD')
  },
  debug: false
}
var knex = require('knex')(options)

describe('mysql structure', function () {
  it('should create schema if not exists', function (done) {
    var SCHEMA = config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
    knex.raw('CREATE SCHEMA IF NOT EXISTS `' + SCHEMA + '` DEFAULT CHARACTER SET utf8;')
      .then(() => {
        done()
      }).catch(done)
  })
  it('should initialize global.ABIBAO', function (done) {
    if (global.ABIBAO.running === true) {
      done()
    } else {
      engine()
        .then(function () {
          expect(global.ABIBAO.uuid).to.be.a('string')
          done()
        })
        .catch(done)
    }
  })
  it('should verify that engine is running', function (done) {
    expect(global.ABIBAO.running).to.be.eq(true)
    done()
  })
  it('should create table answers if not exists', function (done) {
    global.ABIBAO.services.domain.AnswerModel()
    .then(() => {
      done()
    }).catch(done)
  })
  it('should create table users if not exists', function (done) {
    global.ABIBAO.services.domain.UserModel()
    .then(() => {
      done()
    }).catch(done)
  })
  it('should create table smf_votes if not exists', function (done) {
    global.ABIBAO.services.domain.VoteSMFModel()
    .then(() => {
      done()
    }).catch(done)
  })
})
