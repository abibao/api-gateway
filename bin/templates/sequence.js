'use strict'

// declare internal libraries
var path = require('path')

// declare external libraries
var _ = require('lodash'),
  normalize = path.normalize,
  resolve = path.resolve

// declare project libraries
var mustachePromise = require('./mustache')

module.exports = function (model, collection) {
  return [
    mustachePromise(normalize(resolve(__dirname, '../templates/commands/create.tpl')), normalize(resolve(__dirname, '../../src/domain/commands/system')), _.camelCase(model + 'CreateCommand') + '.js', {
      JS_MODEL_NAME: model + 'Model',
      JS_COMMAND_NAME: model + 'CreateCommand'
    }),
    mustachePromise(normalize(resolve(__dirname, '../templates/queries/read.tpl')), normalize(resolve(__dirname, '../../src/domain/queries/system')), _.camelCase(model + 'ReadQuery') + '.js', {
      JS_MODEL_NAME: model + 'Model',
      JS_QUERY_NAME: model + 'ReadQuery'
    }),
    mustachePromise(normalize(resolve(__dirname, '../templates/commands/update.tpl')), normalize(resolve(__dirname, '../../src/domain/commands/system')), _.camelCase(model + 'UpdateCommand') + '.js', {
      JS_MODEL_NAME: model + 'Model',
      JS_COMMAND_NAME: model + 'UpdateCommand'
    }),
    mustachePromise(normalize(resolve(__dirname, '../templates/commands/delete.tpl')), normalize(resolve(__dirname, '../../src/domain/commands/system')), _.camelCase(model + 'DeleteCommand') + '.js', {
      JS_MODEL_NAME: model + 'Model',
      JS_COMMAND_NAME: model + 'DeleteCommand'
    }),
    mustachePromise(normalize(resolve(__dirname, '../templates/queries/filter.tpl')), normalize(resolve(__dirname, '../../src/domain/queries/system')), _.camelCase(model + 'FilterQuery') + '.js', {
      JS_MODEL_NAME: model + 'Model',
      JS_QUERY_NAME: model + 'FilterQuery'
    }),
    mustachePromise(normalize(resolve(__dirname, '../templates/others/test.tpl')), normalize(resolve(__dirname, '../../test')), _.camelCase(model + 'MochaTest') + '.js', {
      JS_DESCRIBE_NAME: model.toLowerCase() + ' auto test',
      JS_MODEL_NAME: model + 'Model',
      JS_PROMISE_CREATE: _.camelCase(model + 'CreateCommand'),
      JS_PROMISE_READ: _.camelCase(model + 'ReadQuery'),
      JS_PROMISE_UPDATE: _.camelCase(model + 'UpdateCommand'),
      JS_PROMISE_DELETE: _.camelCase(model + 'DeleteCommand')
    })
  ]
}
