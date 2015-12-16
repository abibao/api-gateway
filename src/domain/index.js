"use strict";

var options = {
  host: 'store.abibao.com',
  port: 28015,
  db: 'test',
  authKey: '8UR40M2nQ8leURX262xY0OokvfhQunG4'
};
var thinky = require('thinky')(options);

module.exports = {
  
  // injected
  logger: null,
  logger_slack: null,
  io: null,
  thinky: thinky,
  ThinkyErrors: thinky.Errors,
  
  // models
  IndividualModel: require('./models/IndividualModel')(thinky),
  
  // commands
  PostMessageOnSlackCommand: require('./commands/PostMessageOnSlackCommand'),
  CreateIndividualCommand: require('./commands/CreateIndividualCommand'),
  
  // queries
  CountIndividualsQuery: require('./queries/CountIndividualsQuery'),
  ReadShortIndividualQuery: require('./queries/ReadShortIndividualQuery'),
  ReadShortIndividualsListQuery: require('./queries/ReadShortIndividualsListQuery'),
  FindShortIndividualByEmailQuery: require('./queries/FindShortIndividualByEmailQuery'),
  
  // events
  CreateIndividualEvent: require('./events/CreateIndividualEvent'),
  UpdateIndividualEvent: require('./events/UpdateIndividualEvent'),
  
  // listeners
  IndividualsListenerChanged: require('./listeners/IndividualsListenerChanged'),
  
};