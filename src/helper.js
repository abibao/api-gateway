'use strict'

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
    host: global.ABIBAO.config('ABIBAO_API_GATEWAY_RABBITMQ_HOST'),
    port: global.ABIBAO.config('ABIBAO_API_GATEWAY_RABBITMQ_PORT'),
    user: global.ABIBAO.config('ABIBAO_API_GATEWAY_RABBITMQ_USER'),
    pass: global.ABIBAO.config('ABIBAO_API_GATEWAY_RABBITMQ_PASS')
  }
  var url = 'amqp://'
  if (options.user && options.pass) {
    url = url + options.user + ':' + options.pass + '@'
  }
  url = url + options.host + ':' + options.port
  return url
}
