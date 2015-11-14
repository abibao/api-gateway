"use strict";

var r = require('rethinkdb');

module.exports = function(data, callback) {
  try {
    var self = this;
    // add a new individual in rethinkdb (minimul values)
    r.table('individuals')
    .insert(data)
    .run(self.rethinkdb, function(err, result) {
      // on error do something
      if (err) return callback(err);
      // log the result as debug
      self.logger.debug('command', 'createIndividual', result);
      self.logger.debug('command', 'createIndividual', data.email);
      // push the event
      self.individualCreated(data); 
      // run another command (only in production)
      if (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) self.postMessageOnSlack('info', 'event individualCreated'+' < '+data.email+' >'); 
      // end of command
      callback();
    });
  } catch (e) {
    self.logger.error('command', 'createIndividual', e);
    callback(e);
  }
};