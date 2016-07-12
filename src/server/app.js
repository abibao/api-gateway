'use strict'

var path = require('path')
var serveStatic = require('feathers').static
var favicon = require('serve-favicon')
var compress = require('compression')
var cors = require('cors')
var feathers = require('feathers')
var configuration = require('feathers-configuration')
var authentication = require('feathers-authentication')
var hooks = require('feathers-hooks')
var rest = require('feathers-rest')
var bodyParser = require('body-parser')
var socketio = require('feathers-socketio')
var middleware = require('./middleware')
var services = require('./services')

var app = feathers()

app.configure(configuration(path.join(__dirname, '../server')))

var whitelist = app.get('corsWhitelist')
var corsOptions = {
  origin(origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1
    callback(null, originIsWhitelisted)
  }
}

app.use(compress())
  .options('*', cors(corsOptions))
  .use(cors(corsOptions))
  .use(favicon(path.join(app.get('public'), 'favicon.ico')))
  .use('/administrator', serveStatic(app.get('public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(authentication())
  .configure(socketio())
  .configure(services)
  .configure(middleware)

module.exports = app
