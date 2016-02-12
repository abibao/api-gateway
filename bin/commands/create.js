"use strict";

// Promise
var Promise = require("bluebird");

// declare internal libraries
var path = require('path'),
    _ = require('lodash'),
    normalize = path.normalize,
    resolve = path.resolve;

// declare external libraries
// ...

// declare project libraries
var error = require('./../console').error,
    notice = require('./../console').notice,
    warning = require('./../console').warning,
    mustachePromise = require('./mustache');

var errorPromised = function(e) {
  error(e);
};

module.exports = function(table, collection, model) {

  warning('Task: ', 'Create');
  warning('***********************************************************************');

  try {
    
    notice('[x] table ', table);
    notice('[x] collection ', collection);
    notice('[x] model ', model);
    
    var sequence = [
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/models/default.tpl')), normalize(resolve(__dirname,'../../src/domain/models')), model+'Model.js', { 
        JS_SCHEMA_NAME: model+'Schema',
        JS_MODEL_NAME: model+'Model',
        JS_TABLE_NAME: table
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/listeners/default.tpl')), normalize(resolve(__dirname,'../../src/domain/listeners')), model+'ListenerChanged.js', { 
        JS_MODEL_NAME: model+'Model',
        JS_EVENT_NAME: model,
        JS_LISTENER_NAME: model+'ListenerChanged'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/events/default.tpl')), normalize(resolve(__dirname,'../../src/domain/events')), model+'CreateEvent.js', { 
        JS_EVENT_NAME: model+'CreateEvent',
        JS_IO_EVENT_NAME: 'EVENT_'+model.toUpperCase()+'_CREATED'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/events/default.tpl')), normalize(resolve(__dirname,'../../src/domain/events')), model+'UpdateEvent.js', { 
        JS_EVENT_NAME: model+'UpdateEvent',
        JS_IO_EVENT_NAME: 'EVENT_'+model.toUpperCase()+'_UPDATE'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/events/delete.tpl')), normalize(resolve(__dirname,'../../src/domain/events')), model+'DeleteEvent.js', { 
        JS_EVENT_NAME: model+'DeleteEvent',
        JS_IO_EVENT_NAME: 'EVENT_'+model.toUpperCase()+'_DELETED'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/queries/find.tpl')), normalize(resolve(__dirname,'../../src/domain/queries')), model+'FindQuery.js', { 
        JS_MODEL_NAME: model+'Model',
        JS_QUERY_NAME: model+'FindQuery'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/commands/create.tpl')), normalize(resolve(__dirname,'../../src/domain/commands')), model+'CreateCommand.js', { 
        JS_MODEL_NAME: model+'Model',
        JS_COMMAND_NAME: model+'CreateCommand'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/queries/read.tpl')), normalize(resolve(__dirname,'../../src/domain/queries')), model+'ReadQuery.js', { 
        JS_MODEL_NAME: model+'Model',
        JS_QUERY_NAME: model+'ReadQuery'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/commands/update.tpl')), normalize(resolve(__dirname,'../../src/domain/commands')), model+'UpdateCommand.js', { 
        JS_MODEL_NAME: model+'Model',
        JS_COMMAND_NAME: model+'UpdateCommand'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/domain/commands/delete.tpl')), normalize(resolve(__dirname,'../../src/domain/commands')), model+'DeleteCommand.js', { 
        JS_MODEL_NAME: model+'Model',
        JS_COMMAND_NAME: model+'DeleteCommand'
      }),/*
      mustachePromise(normalize(resolve(__dirname,'../templates/server/gateway/controllers/find.tpl')), normalize(resolve(__dirname,'../../src/server/gateway/controllers/fcrud')), model+'FindController.js', { 
        JS_HTTP_PATH: '/v1/'+collection.toLowerCase(),
        JS_VALIDATE_PAYLOAD: require(normalize(resolve(__dirname,'../../src/domain/schemas',model+'Schema'))).Find(),
        JS_MODEL_NAME: model+'Model',
        JS_QUERY_NAME: model+'FindQuery'
      }),
      
      mustachePromise(normalize(resolve(__dirname,'../templates/server/gateway/controllers/read.tpl')), normalize(resolve(__dirname,'../../src/server/gateway/controllers/fcrud')), model+'ReadController.js', { 
        JS_HTTP_PATH: '/v1/'+collection.toLowerCase(),
        JS_MODEL_NAME: model+'Model',
        JS_QUERY_NAME: model+'ReadQuery'
      }),
      mustachePromise(normalize(resolve(__dirname,'../templates/server/gateway/controllers/update.tpl')), normalize(resolve(__dirname,'../../src/server/gateway/controllers/fcrud')), model+'UpdateController.js', { 
        JS_HTTP_PATH: '/v1/'+collection.toLowerCase(),
        JS_VALIDATE_PAYLOAD: require(normalize(resolve(__dirname,'../../src/domain/schemas',model+'Schema'))).Update(),
        JS_MODEL_NAME: model+'Model',
        JS_COMMAND_NAME: model+'UpdateCommand'
      }),*/
    ];
    
    var schema = require(normalize(resolve(__dirname,'../../src/domain/schemas',model+'Schema')));
    if ( _.isFunction(schema.Create) ) {
      sequence.push(
        mustachePromise(normalize(resolve(__dirname,'../templates/server/gateway/controllers/create.tpl')), normalize(resolve(__dirname,'../../src/server/gateway/controllers/fcrud')), model+'CreateController.js', { 
          JS_HTTP_PATH: '/v1/'+collection.toLowerCase(),
          JS_VALIDATE_PAYLOAD: require(normalize(resolve(__dirname,'../../src/domain/schemas',model+'Schema'))).Create(),
          JS_MODEL_NAME: model+'Model',
          JS_COMMAND_NAME: model+'CreateCommand'
        })
      );
    }
    
    Promise.all(sequence).catch(errorPromised);
    
  } catch(e) {
    error(e);
    return process.exit(1);
  }
  
};