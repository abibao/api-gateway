#!/usr/bin/env node
'use strict'

var colors = require('colors/safe')

var envValue = null

var program = require('commander')
program
  .arguments('[environment]')
  .action((environment) => {
    envValue = environment
  })

program.parse(process.argv)

console.log('')
console.log(colors.green.bold('***************************************************'))
console.log(colors.green.bold('test mysql connection'))
console.log(colors.green.bold('***************************************************'))
console.log(colors.yellow.bold('environment:'), envValue || 'no environment given!')

if (!envValue) {
  process.exit(1)
}

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-' + envValue + '.json' })

// mysql
var optionsMysql = {
  client: 'pg',
  connection: {
    host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
    port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'),
    database: nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_MVP')
  },
  debug: false
}
var knex = require('knex')(optionsMysql)
knex.schema.hasTable('users').then((exists) => {
  knex.destroy()
  console.log('\n', colors.bgGreen.bold(' DONE! '), '\n')
  process.exit(0)
}).catch((err) => {
  knex.destroy()
  console.log('\n', colors.bgRed.bold(' ERROR! '))
  console.log(err, '\n')
  process.exit(1)
})
