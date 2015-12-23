"use strict";

var options = {
  host: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST,
  port: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT,
  db: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_DB,
  authKey: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY
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
  AdministratorModel: require('./models/AdministratorModel')(thinky),
  
  // commands
  PostMessageOnSlackCommand: require('./commands/PostMessageOnSlackCommand'),
  CreateIndividualCommand: require('./commands/CreateIndividualCommand'),
  UpdateIndividualCommand: require('./commands/UpdateIndividualCommand'),
  SendIndividualEmailVerificationCommand: require('./commands/SendIndividualEmailVerificationCommand'),
  
  // queries
  CountIndividualsQuery: require('./queries/CountIndividualsQuery'),
  ReadShortIndividualQuery: require('./queries/ReadShortIndividualQuery'),
  ReadShortIndividualsListQuery: require('./queries/ReadShortIndividualsListQuery'),
  FindShortIndividualsQuery: require('./queries/FindShortIndividualsQuery'),
  FindShortAdministratorsQuery: require('./queries/FindShortAdministratorsQuery'),
  
  // events
  CreateIndividualEvent: require('./events/CreateIndividualEvent'),
  UpdateIndividualEvent: require('./events/UpdateIndividualEvent'),
  SendIndividualEmailVerificationEvent: require('./events/SendIndividualEmailVerificationEvent'),
  
  // listeners
  IndividualsListenerChanged: require('./listeners/IndividualsListenerChanged'),
  
};