function CampaignsActions(facade) {

	var self = this;
  
  self.createItemMultipleChoice = function(urn) {
    var payload = {
      campaign: urn,
      question: "The question ?",
      required: true,
      multipleSelections: false,
      randomize: false,
      addCustomOption: false,
      alignment: "horizontal",
      label: "ABIBAO_ANSWER_"
    };
    facade.call("POST", "/v1/campaigns/items/multiple-choice", payload).then(function(item) {
      console.log("CampaignsActions.createItemMultipleChoice", item);
      // facade.setCurrentCampaign(campaign);
    }).catch(function(error) {
      console.log("CampaignsActions.createItemMultipleChoice", "ERROR", error);
      facade.trigger("EVENT_CALLER_ERROR", error);
    });
	};
  
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