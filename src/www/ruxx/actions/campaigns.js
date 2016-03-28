function CampaignsActions(facade) {

	var self = this;
  self.facade = facade;
  
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
    return new Promise(function(resolve, reject) {
  	  var data = lodash.clone(campaign);
  	  delete data.createdAt;
  	  delete data.modifiedAt;
  	  delete data.urn;
  	  delete data.items;
  	  delete data.company;
  	  self.facade.setLoading(true);
      facade.call("PATCH", "/v1/campaigns/"+campaign.urn, data).then(function(campaign) {
        self.facade.setLoading(false);
        self.facade.debugAction("CampaignsActions.update %o", campaign);
        resolve();
      }).catch(function(error) {
        self.facade.setLoading(false);
        self.facade.debugAction("CampaignsActions.update (ERROR) %o", error);
        self.facade.trigger("EVENT_CALLER_ERROR", error);
        reject(error);
      });
    });
	};
	
	self.updateItem = function(item) {
    return new Promise(function(resolve, reject) {
  	  var data = lodash.clone(item);
  	  delete data.iconType;
  	  delete data.createdAt;
  	  delete data.modifiedAt;
  	  delete data.urn;
  	  delete data.company;
  	  delete data.label;
  	  delete data.type;
  	  delete data.choices;
  	  self.facade.setLoading(true);
      facade.call("PATCH", "/v1/campaigns/items/"+item.urn, data).then(function(item) {
        self.facade.setLoading(false);
        self.facade.debugAction("CampaignsActions.updateItem %o", item);
        resolve();
      }).catch(function(error) {
        self.facade.setLoading(false);
        self.facade.debugAction("CampaignsActions.updateItem (ERROR) %o", error);
        self.facade.trigger("EVENT_CALLER_ERROR", error);
        reject(error);
      });
    });
	}
	
	self.selectCampaign = function(urn) {
	  return new Promise(function(resolve, reject) {
  	  self.facade.setLoading(true);
      self.facade.call("GET", "/v1/campaigns/"+urn)
      .then(function(campaign) {
        self.facade.debugAction("CampaignsActions.selectCampaign %o", campaign);
        self.facade.setLoading(false);
        facade.setCurrentCampaign(campaign);
        resolve();
      })
      .catch(function(error) {
        self.facade.setLoading(false);
        self.facade.debugAction("CampaignsActions.selectCampaign (ERROR) %o", error);
        self.facade.trigger("EVENT_CALLER_ERROR", error);
        reject(error);
      });
	  });
	};
	
}