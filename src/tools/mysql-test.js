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
    host: global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_HOST'),
    port: global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_PORT'),
    user: global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_USER'),
    password: global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_PASS'),
    database: global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_DATABASE')
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
