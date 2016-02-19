"use strict";

// Promise
var Promise = require("bluebird");

// declare internal libraries
var path = require('path'),
    async = require('async'),
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
    
    warning('START sequence');
    warning('***********************************************************************');
    
    var sequence_items = [
      {
        table: 'entities',
        collection: 'Entities',
        model: 'Entity'
      },
      {
        table: 'surveys',
        collection: 'Surveys',
        model: 'Survey'
      },
      {
        table: 'campaigns',
        collection: 'Campaigns',
        model: 'Campaign'
      },
      {
        table: 'campaigns_items',
        collection: 'CampaignsItems',
        model: 'CampaignItem'
      },
      {
        table: 'individuals',
        collection: 'Individuals',
        model: 'Individual'
      },
      {
        table: 'administrators',
        collection: 'Administrators',
        model: 'Administrator'
      }
    ];
    
    async.mapSeries(sequence_items, function(item, next) {
      
      table = item.table;
      collection = item.collection;
      model = item.model;
      
      notice('[x] table ', table);
      notice('[x] collection ', collection);
      notice('[x] model ', model);
      warning('***********************************************************************');
      
      var sequence = [
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/commands/create.tpl')), normalize(resolve(__dirname,'../../src/domain/commands/system')), model+'CreateCommand.js', { 
          JS_MODEL_NAME: model+'Model',
          JS_COMMAND_NAME: model+'CreateCommand'
        }),
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/commands/update.tpl')), normalize(resolve(__dirname,'../../src/domain/commands/system')), model+'UpdateCommand.js', { 
          JS_MODEL_NAME: model+'Model',
          JS_COMMAND_NAME: model+'UpdateCommand'
        }),
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/queries/read.tpl')), normalize(resolve(__dirname,'../../src/domain/queries/system')), model+'ReadQuery.js', { 
          JS_MODEL_NAME: model+'Model',
          JS_QUERY_NAME: model+'ReadQuery'
        }),
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/queries/filter.tpl')), normalize(resolve(__dirname,'../../src/domain/queries/system')), model+'FilterQuery.js', { 
          JS_MODEL_NAME: model+'Model',
          JS_QUERY_NAME: model+'FilterQuery'
        }),
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/commands/delete.tpl')), normalize(resolve(__dirname,'../../src/domain/commands/system')), model+'DeleteCommand.js', { 
          JS_MODEL_NAME: model+'Model',
          JS_COMMAND_NAME: model+'DeleteCommand'
        }),
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/listeners/default.tpl')), normalize(resolve(__dirname,'../../src/domain/listeners/system')), collection+'ListenerChanged.js', { 
          JS_MODEL_NAME: model+'Model',
          JS_EVENT_NAME: model,
          JS_LISTENER_NAME: collection+'ListenerChanged'
        }),
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/events/default.tpl')), normalize(resolve(__dirname,'../../src/domain/events/system')), model+'CreateEvent.js', { 
          JS_EVENT_NAME: model+'CreateEvent',
          JS_IO_EVENT_NAME: 'EVENT_'+model.toUpperCase()+'_CREATED'
        }),
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/events/default.tpl')), normalize(resolve(__dirname,'../../src/domain/events/system')), model+'UpdateEvent.js', { 
          JS_EVENT_NAME: model+'UpdateEvent',
          JS_IO_EVENT_NAME: 'EVENT_'+model.toUpperCase()+'_UPDATE'
        }),
        mustachePromise(normalize(resolve(__dirname,'../templates/domain/events/delete.tpl')), normalize(resolve(__dirname,'../../src/domain/events/system')), model+'DeleteEvent.js', { 
          JS_EVENT_NAME: model+'DeleteEvent',
          JS_IO_EVENT_NAME: 'EVENT_'+model.toUpperCase()+'_DELETED'
        })
      ];
      Promise.all(sequence).catch(errorPromised);
      next();
      
    }, function(error, result) {
      warning('END sequence');
      warning('***********************************************************************');
    });
    
  } catch(e) {
    error(e);
    return process.exit(1);
  }
  
};