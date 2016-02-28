"use strict";

var CURRENT_ACTION = "Query";
var CURRENT_NAME = "IndividualReadPopulateQuery";
 
module.exports = function(id, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "execute");
    
    self.systemReadDataQuery(self.IndividualModel, id).then(function(individual) {
      return self.systemFindDataQuery(self.SurveyModel, {individual:id}).then(function(surveys) {
        delete individual.hashedPassword;
        delete individual.salt;
        individual.surveys = surveys;
        return self.systemReadDataQuery(self.EntityModel, individual.charity).then(function(charity) {
          individual.charity = charity;
          callback(null, individual);
        });
      });
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};