'use strict'

var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

var _ = require('lodash')

module.exports.getTypeFromFilename = function (filename) {
  var parts = _.snakeCase(filename).split('_')
  parts.pop()
  return _.upperFirst(parts.pop())
}

module.exports.getNameFromFilename = function (filename) {
  var parts = _.snakeCase(filename).split('_')
  parts.pop()
  var type = _.upperFirst(parts.pop())
  return _.upperFirst(_.camelCase(parts.join('_'))) + type
}

module.exports.rabbitmqUrl = function () {
  var options = {
    host: config.get('RABBITMQ_ENV_DOCKERCLOUD_SERVICE_FQDN'),
    port: config.get('RABBITMQ_PORT_5672_TCP_PORT'),
    user: 'admin',
    pass: config.get('RABBITMQ_ENV_RABBITMQ_PASS')
  }
  var url = 'amqp://'
  if (options.user && options.pass) {
    url = url + options.user + ':' + options.pass + '@'
  }
  url = url + options.host + ':' + options.port
  return url
}
