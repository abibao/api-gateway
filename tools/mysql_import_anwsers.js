'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var async = require('async')
var path = require('path')
var fse = require('fs-extra')

var optionsMySQL = {
  client: 'mysql',
  connection: {
    host: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_HOST'),
    port: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PORT'),
    user: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PASSWORD'),
    database: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  },
  debug: false
}

// step 1 : create ./.cache/mysql/answers
