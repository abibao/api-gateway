function EntitiesActions(facade) {

	var self = this;
	self.facade = facade;
	
	self.update = function(entity) {
	  var data = _.clone(entity);
	  delete data.createdAt;
	  delete data.modifiedAt;
	  delete data.urn;
	  delete data.campaigns;
    self.facade.call("PATCH", "/v1/entities/"+entity.urn, data).then(function(entity) {
      self.facade.debugAction("EntitiesActions.update %o", entity);
      self.facade.trigger("EVENT_RIOT_UPDATE");
      self.facade.trigger("EVENT_UPDATE_ENTITY");
    }).catch(function(error) {
      self.facade.debugAction("EntitiesActions.update (ERROR) %o", error);
      self.facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
	self.selectEntity = function(urn) {
    self.facade.call("GET", "/v1/entities/"+urn).then(function(entity) {
      self.facade.debugAction("EntitiesActions.selectEntity %o", entity);
      self.populateCampaigns(entity);
    }).catch(function(error) {
      self.facade.debugAction("EntitiesActions.selectEntity (ERROR) %o", error);
      self.facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
	self.list = function() {
    self.facade.call("GET", "/v1/entities").then(function(entities) {
      self.facade.debugAction("EntitiesActions.list %o", entities);
      self.facade.stores.entities.charities = _.filter(entities, function(item) {
        return (item.type==="charity");
      });
      self.facade.stores.entities.companies = _.filter(entities, function(item) {
        return (item.type==="company" || item.type==="abibao");
      });
      self.facade.trigger("EVENT_RIOT_UPDATE");
    }).catch(function(error) {
      self.facade.debugAction("EntitiesActions.list (ERROR) %o", error);
      self.facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
	self.populateCampaigns = function(entity) {
	  self.facade.call("GET", "/v1/entities/"+entity.urn+"/campaigns").then(function(campaigns) {
      self.facade.debugAction("EntitiesActions.populateCampaigns %o", campaigns);
      entity.campaigns = campaigns;
      self.facade.setCurrentEntity(entity);
    }).catch(function(error) {
      self.facade.debugAction("EntitiesActions.populateCampaigns (ERROR) %o", error);
      self.facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
}