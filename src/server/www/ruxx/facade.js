function Facade() {

	var self = this;
	riot.observable(self);

	self.version = "1.4.0";
	
  self.tags = {};
  self.stores = {
    auth: new AuthStore(),
    entities: new EntitiesStore()
  };
  self.actions = {
    auth: new AuthActions(self),
    campaigns: new CampaignsActions(self),
    entities: new EntitiesActions(self)
  };
  
  self.on("CREATE_ABIBAO_COMPONENT_MULTIPLE_CHOICE", function(urn) {
    console.log("CREATE_ABIBAO_COMPONENT_MULTIPLE_CHOICE", urn);
    self.actions.campaigns.createItemMultipleChoice(urn);
  });
  
  self.on("EVENT_SELECT_CAMPAIGN", function(urn) {
    console.log("EVENT_SELECT_CAMPAIGN", urn);
    self.actions.campaigns.selectCampaign(urn);
  });
  
  self.on("EVENT_SELECT_ENTITY", function(urn) {
    console.log("EVENT_SELECT_ENTITY", urn);
    self.actions.entities.selectEntity(urn);
  });
  
  self.on("EVENT_UPDATE_ENTITY", function() {
    self.actions.entities.list();
  });
  
  self.on("EVENT_GATEWAY_ERROR", function(error) {
    console.log("EVENT_GATEWAY_ERROR", error);
    Materialize.toast(error.message, 1500, "deep-orange darken-3");
  });
  
  self.on("EVENT_RIOT_UPDATE", function() {
    console.log("EVENT_RIOT_UPDATE");
    riot.update();
  });
  
  self.on("EVENT_BACK_SELECTED_ENTITY", function() {
    self.setCurrentCampaign(null);
    riot.route("/entity/"+self._currentCampaign.company.urn);
  });
  
  self.on("EVENT_LOGIN_AUTH_COMPLETE", function() {
    if ( self.getCurrentState()===Facade.STATE_LOGIN ) { riot.route("/homepage"); }
    self.actions.entities.list();
  });
  
  /** CURRENT CAMPAIGN **/
  self._currentCampaign = null;
  self.getCurrentCampaign = function() {
    return self._currentCampaign;
  };
  self.setCurrentCampaign = function(value) {
    console.log("setCurrentCampaign", value);
    self._currentCampaign = _.clone(value);
    riot.route("/campaign/"+self._currentCampaign.urn);
    Materialize.toast("Chargement \"campaign\" effectuée", 1500, "light-green darken-2");
    facade.tags["campaign"].trigger("EVENT_CREATION_COMPLETE");
  };
  
  /** CURRENT ENTITY **/
  self._currentEntity = null;
  self.getCurrentEntity = function() {
    return self._currentEntity;
  };
  self.setCurrentEntity = function(value) {
    console.log("setCurrentEntity", value);
    self._currentEntity = _.clone(value);
    riot.route("/entity/"+self._currentEntity.urn);
    Materialize.toast("Chargement \"entity\" effectuée", 1500, "light-green darken-2");
    facade.tags["entity"].trigger("EVENT_CREATION_COMPLETE");
  };
  
  /** CURRENT STATE **/
  self._currentState = Facade.STATE_HOMEPAGE;
  self.getCurrentState = function() {
    return self._currentState;
  };
  self.setCurrentState = function(value) {
    console.log("setCurrentState", value);
    self._currentState = value;
    self.trigger("EVENT_RIOT_UPDATE");
  };
  
  self.start = function() {
    console.log("start facade");
    riot.route.start(true);
    // current routes
    var route = window.location.hash.split("/");
    switch(route[0]) {
      case "#campaign":
        var campaign = window.location.hash.split("/")[1];
        self.setCurrentState(Facade.STATE_CAMPAIGN);
        self.trigger("EVENT_SELECT_CAMPAIGN", campaign);
        break;
      case "#entity":
        var entity = window.location.hash.split("/")[1];
        self.setCurrentState(Facade.STATE_ENTITY);
        self.trigger("EVENT_SELECT_ENTITY", entity);
        break;
      default:
        break;
    }
    // auth
    if ( facade.stores.auth.authentified() ) self.trigger("EVENT_LOGIN_AUTH_COMPLETE");
  };
  
	self.call = function(method, url, payload) {
	  return new Promise(function(resolve, reject) {
      // Headers
      $.ajaxSetup({
        headers: { 'Authorization': Cookies.get("Authorization") }
      });
      // Resolve 
      var jqxhr = $.ajax({
        method: method,
        url: url,
        data: payload
      }, function(data) {
        jqxhr.hasError = false;
      })
      .fail(function(error) {
        jqxhr.hasError = true;
      })
      .done(function(data) {
      })
      .always(function(data) {
      });
      // Set another completion function for the request above
      jqxhr.complete(function(data) {
        console.log("call complete", method, url, jqxhr.hasError, data);
        if (jqxhr.hasError) {
          self.trigger("EVENT_GATEWAY_ERROR", data);
          reject(data);
        } else {
          self.trigger("EVENT_RIOT_UPDATE", data);
          resolve(data);
        }
      });
	  });
	};
	
}

Facade.Tags = 6; // sum of "_layout" and "views"
Facade.STATE_404_ERROR = "error404";
Facade.STATE_LOGIN = "login";
Facade.STATE_HOMEPAGE = "homepage";
Facade.STATE_CAMPAIGN = "campaign";
Facade.STATE_ENTITY = "entity";