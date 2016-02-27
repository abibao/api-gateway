"use strict";

var CURRENT_ACTION = "Query";
var CURRENT_NAME = "IndividualsCountQuery";

module.exports = function(callback) {
  
  var self = this;

  try {

    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "execute");
    
    self.IndividualModel.count().execute().then(function(total) {
      callback(null, {count: total});
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};