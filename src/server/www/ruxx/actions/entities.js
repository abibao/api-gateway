function EntitiesActions() {

	var self = this;
	
	self.update = function(entity) {
	  var data = _.clone(entity);
	  delete data.createdAt;
	  delete data.modifiedAt;
	  delete data.urn;
	  delete data.campaigns;
    facade.call("PATCH", "/v1/entities/"+entity.urn, data).then(function(entity) {
      console.log("EntitiesActions.update", entity);
      facade.trigger("EVENT_RIOT_UPDATE");
      facade.trigger("EVENT_UPDATE_ENTITY");
    }).catch(function(error) {
      console.log("EntitiesActions.update", "ERROR", error);
      facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
	self.selectEntity = function(urn) {
    facade.call("GET", "/v1/entities/"+urn).then(function(entity) {
      console.log("EntitiesActions.selectEntity", entity);
      self.populateCampaigns(entity);
    }).catch(function(error) {
      console.log("EntitiesActions.selectEntity", "ERROR", error);
      facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
	self.list = function() {
    facade.call("GET", "/v1/entities").then(function(entities) {
      console.log("EntitiesActions.list", entities);
      facade.stores.entities.charities = _.filter(entities, function(item) {
        return (item.type==="charity");
      });
      facade.stores.entities.companies = _.filter(entities, function(item) {
        return (item.type==="company" || item.type==="abibao");
      });
      facade.trigger("EVENT_RIOT_UPDATE");
    }).catch(function(error) {
      console.log("EntitiesActions.list", "ERROR", error);
      facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
	self.populateCampaigns = function(entity) {
	  facade.call("GET", "/v1/entities/"+entity.urn+"/campaigns").then(function(campaigns) {
      console.log("EntitiesActions.populateCampaigns", campaigns);
      entity.campaigns = campaigns;
      facade.setCurrentEntity(entity);
    }).catch(function(error) {
      console.log("EntitiesActions.populateCampaigns", "ERROR", error);
      facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
}