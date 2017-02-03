'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

describe('mysql structure', function () {
  it('should create database analytics.answers', function (done) {
    var options = {
      client: 'mysql',
      connection: {
        host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
        port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
        user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
        password: nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'),
        database: nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_ANALYTICS')
      },
      debug: false
    }
    var knex = require('knex')(options)
    knex.schema.createTableIfNotExists('answers', function (table) {
      table.increments('id')
      table.string('email')
      table.string('campaign_id')
      table.string('charity_id')
      table.string('campaign_name')
      table.string('charity_name')
      table.string('question')
      table.string('answer')
      table.string('answer_text')
      table.timestamp('createdAt').defaultTo(knex.fn.now())
    }).then(() => {
      knex.destroy()
      done()
    }).catch((error) => {
      knex.destroy()
      done(error)
    })
  })
  it('should create database analytics.users', function (done) {
    var options = {
      client: 'mysql',
      connection: {
        host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
        port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
        user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
        password: nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'),
        database: nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_ANALYTICS')
      },
      debug: false
    }
    var knex = require('knex')(options)
    knex.schema.createTableIfNotExists('users', function (table) {
      table.increments('id')
      table.string('email')
      table.string('charity')
      table.string('registeredCharity')
      table.integer('age')
      table.string('csp')
      table.string('department')
      table.string('gender')
      table.timestamp('modifiedAt')
      table.timestamp('createdAt').defaultTo(knex.fn.now())
    }).then(() => {
      knex.destroy()
      done()
    }).catch((error) => {
      knex.destroy()
      done(error)
    })
  })
  it('should create database analytics.smf_votes', function (done) {
    var options = {
      client: 'mysql',
      connection: {
        host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
        port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
        user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
        password: nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'),
        database: nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_ANALYTICS')
      },
      debug: false
    }
    var knex = require('knex')(options)
    knex.schema.createTableIfNotExists('smf_votes', function (table) {
      table.increments('id')
      table.string('email')
      table.string('charity')
      table.string('registeredCharity')
      table.integer('age')
      table.string('csp')
      table.string('department')
      table.string('gender')
      table.timestamp('modifiedAt')
      table.timestamp('createdAt').defaultTo(knex.fn.now())
    }).then(() => {
      knex.destroy()
      done()
    }).catch((error) => {
      knex.destroy()
      done(error)
    })
  })
})
