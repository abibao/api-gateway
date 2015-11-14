"use strict";

module.exports = {
  
  // injected
  logger: null,
  logger_slack: null,
  rethinkdb: null,
  io: null,
  
  // commands
  createIndividual: require('./commands/users/createIndividual'),
  postMessageOnSlack: require('./commands/users/postMessageOnSlack'),
  
  // events
  individualCreated: require('./events/users/individualCreated'),
  individualsListenChanged: require('./events/users/individualsListenChanged'),
  
  // queries
  
  // models
  individual: require('./models/users/individual'),
  
};