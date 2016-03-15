function CampaignsActions(facade) {

	var self = this;
  
  self.update = function(campaign) {
	  var data = _.clone(campaign);
	  delete data.createdAt;
	  delete data.modifiedAt;
	  delete data.urn;
	  delete data.items;
	  delete data.company;
    facade.call("PATCH", "/v1/campaigns/"+campaign.urn, data).then(function(campaign) {
      console.log("CampaignsActions.update", campaign);
      facade.trigger("EVENT_RIOT_UPDATE");
      facade.trigger("EVENT_UPDATE_CAMPAIGN");
    }).catch(function(error) {
      console.log("EntitiesActions.update", "ERROR", error);
      facade.trigger("CampaignsActions", error);
    });
	};
	
	self.selectCampaign = function(urn) {
    facade.call("GET", "/v1/campaigns/"+urn).then(function(campaign) {
      console.log("CampaignsActions.selectCampaign", campaign);
      facade.setCurrentCampaign(campaign);
    }).catch(function(error) {
      console.log("CampaignsActions.selectCampaign", "ERROR", error);
      facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
	
}