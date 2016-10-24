'use strict'

// load environnement configuration
var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

var knex = require('../src/lib/mysql').knex
var service = require('feathers-knex')

describe('mysql structure', function () {
  it('should create schema if not exists', function (done) {
    var SCHEMA = config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
    knex.raw('CREATE SCHEMA IF NOT EXISTS `' + SCHEMA + '` DEFAULT CHARACTER SET utf8;')
      .then(() => {
        done()
      }).catch(done)
  })
  it('should create table if not exists', function (done) {
    var database = config.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
    knex.schema.withSchema(database).createTableIfNotExists('messages', table => {
      table.increments('id')
      table.string('text')
      table.boolean('read')
      done()
    })
  })
})
