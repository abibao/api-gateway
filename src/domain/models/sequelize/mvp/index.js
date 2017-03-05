'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

const sequelize = new Sequelize(global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_DATABASE'), global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_USER'), global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_PASS'), {
  host: global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_HOST'),
  port: global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_PORT'),
  logging: global.ABIBAO.debuggers.mysql,
  dialect: 'postgres'
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
