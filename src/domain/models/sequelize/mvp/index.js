'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

const sequelize = new Sequelize(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_MVP'), nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'), nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'), {
  host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
  port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
  logging: global.ABIBAO.debuggers.mysql,
  dialect: 'mysql'
})

let db = {}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

module.exports = db
