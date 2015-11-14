"use strict";

var r = require('rethinkdb');

module.exports = function() {
  try {
    var self = this;
    r.table("individuals").changes().run(self.rethinkdb)
    .then(function(cursor) {
      cursor.each(function(err, item) {
        self.logger.debug('event', 'individualsChanged', item);
        // emit the event with socket.io
        self.io.sockets.emit("individualsChanged", item);
      });
    });
  } catch (e) {
    self.logger.error('event', 'individualsChanged', e);
  }
};