"use strict";

// declare internal libraries
var path = require("path");

// declare external libraries
var _ = require("lodash"),
    normalize = path.normalize,
    resolve = path.resolve;

// declare project libraries
var mustachePromise = require("./mustache");
    
module.exports = function(model, collection) {
  return [
    mustachePromise(normalize(resolve(__dirname,"../templates/commands/create.tpl")), normalize(resolve(__dirname,"../../src/domain/commands/system")), _.camelCase(model+"CreateCommand")+".js", { 
      JS_MODEL_NAME: model+"Model",
      JS_COMMAND_NAME: model+"CreateCommand"
    }),
    mustachePromise(normalize(resolve(__dirname,"../templates/queries/read.tpl")), normalize(resolve(__dirname,"../../src/domain/queries/system")), _.camelCase(model+"ReadQuery")+".js", { 
      JS_MODEL_NAME: model+"Model",
      JS_QUERY_NAME: model+"ReadQuery"
    }),
    mustachePromise(normalize(resolve(__dirname,"../templates/commands/update.tpl")), normalize(resolve(__dirname,"../../src/domain/commands/system")), _.camelCase(model+"UpdateCommand")+".js", { 
      JS_MODEL_NAME: model+"Model",
      JS_COMMAND_NAME: model+"UpdateCommand"
    }),
    mustachePromise(normalize(resolve(__dirname,"../templates/commands/delete.tpl")), normalize(resolve(__dirname,"../../src/domain/commands/system")), _.camelCase(model+"DeleteCommand")+".js", { 
      JS_MODEL_NAME: model+"Model",
      JS_COMMAND_NAME: model+"DeleteCommand"
    }),
    mustachePromise(normalize(resolve(__dirname,"../templates/queries/filter.tpl")), normalize(resolve(__dirname,"../../src/domain/queries/system")), _.camelCase(model+"FilterQuery")+".js", { 
      JS_MODEL_NAME: model+"Model",
      JS_QUERY_NAME: model+"FilterQuery"
    }),
    mustachePromise(normalize(resolve(__dirname,"../templates/listeners/default.tpl")), normalize(resolve(__dirname,"../../src/domain/listeners/system")), _.camelCase(collection+"ListenerChanged")+".js", { 
      JS_MODEL_NAME: model+"Model",
      JS_EVENT_NAME: _.camelCase(model),
      JS_LISTENER_NAME: collection+"ListenerChanged"
    }),
    mustachePromise(normalize(resolve(__dirname,"../templates/events/default.tpl")), normalize(resolve(__dirname,"../../src/domain/events/system")), _.camelCase(model+"CreateEvent")+".js", { 
      JS_EVENT_NAME: model+"CreateEvent",
      JS_IO_EVENT_NAME: "EVENT_"+model.toUpperCase()+"_CREATED"
    }),
    mustachePromise(normalize(resolve(__dirname,"../templates/events/default.tpl")), normalize(resolve(__dirname,"../../src/domain/events/system")), _.camelCase(model+"UpdateEvent")+".js", { 
      JS_EVENT_NAME: model+"UpdateEvent",
      JS_IO_EVENT_NAME: "EVENT_"+model.toUpperCase()+"_UPDATE"
    }),
    mustachePromise(normalize(resolve(__dirname,"../templates/events/delete.tpl")), normalize(resolve(__dirname,"../../src/domain/events/system")), _.camelCase(model+"DeleteEvent")+".js", { 
      JS_EVENT_NAME: model+"DeleteEvent",
      JS_IO_EVENT_NAME: "EVENT_"+model.toUpperCase()+"_DELETED"
    })
  ];
};