function Facade() {

	var self = this;
	riot.observable(self);

	self.version = "1.4.0";
	
	self.debug = debug("abibao:facade");
	self.debugCall = debug("abibao:facade:call");
	self.debugAction = debug("abibao:facade:action");
	self.debugHTML = debug("abibao:html");
	
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
  

  self.on("EVENT_RIOT_UPDATE", function() {
    // self.debug("EVENT_RIOT_UPDATE");
    riot.update();
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
    facade.tagscampaign.trigger("EVENT_CREATION_COMPLETE");
  };
  
  /** CURRENT ENTITY **/
  self._currentEntity = null;
  self.getCurrentEntity = function() {
    return self._currentEntity;
  };
  self.setCurrentEntity = function(value) {
    self.debug("setCurrentEntity %o", value);
    self._currentEntity = _.clone(value);
    self.tags.entity.trigger("selectEntityLoadComplete");
    riot.route("/entity/"+self._currentEntity.urn);
  };
  
  /** CURRENT STATE **/
  self._currentState = Facade.STATE_INITIALIZE;
  self.getCurrentState = function() {
    return self._currentState;
  };
  self.setCurrentState = function(value) {
    self.debug("setCurrentState: %s", value);
    self._currentState = value;
    self.trigger("EVENT_RIOT_UPDATE");
  };
  
  self.start = function() {
    // initialize router
    riot.route.start(true);
    // authentified or not ?
    if ( self.stores.auth.authentified()===false ) { 
      window.location = "#login";
      self.setCurrentState(Facade.STATE_LOGIN);
      return riot.route("/login");
    }
    // analayse current route
    var routes = window.location.hash.split("/");
    // go now.
    self.setLoading(true);
    self.actions.entities.list()
    .then(function() {
      self.debug("start facade on %s / authentified=%s", routes[0], self.stores.auth.authentified());
      switch(routes[0]) {
        case "#homepage":
          self.setCurrentState(Facade.STATE_HOMEPAGE);
          break;
        case "#campaign":
          var campaign = routes[1];
          self.setCurrentState(Facade.STATE_CAMPAIGN);
          break;
        case "#entity":
          var entity = routes[1];
          self.actions.entities.selectEntity(entity)
          .then(function() {
            self.setCurrentState(Facade.STATE_ENTITY);
          })
          .catch(function(error) {
            
          });
          break;
        default:
          break;
      }
    })
    .catch(function(error) {
      self.debug("error facade %o", error);
    });
  };
  
	self.call = function(method, url, payload) {
	  self.debugCall("new promise %s %s %o", method, url, payload);
	  self.setLoading(true);
	  return new Promise(function(resolve, reject) {
      // Headers
      $.ajaxSetup({
        headers: { "Authorization": Cookies.get("Authorization") }
      });
      // Resolve 
      $.ajax({
        method: method,
        url: url,
        data: payload
      })
      .fail(function(error) {
        self.debugCall("error %s %s %o", method, url, error);
        self.trigger("EVENT_CALLER_ERROR", error);
        return reject(error);
      })
      .done(function(data) {
        self.debugCall("complete %s %s %o", method, url, data);
        self.trigger("EVENT_RIOT_UPDATE");
        return resolve(data);
      });
	  });
	};
	
	self._loading = false;
	self.setLoading = function(value) {
	  self._loading = value;
	  self.trigger("EVENT_RIOT_UPDATE");
	};
	self.getLoading = function() {
	  return self._loading;
	};
	
	self.on("EVENT_CALLER_ERROR", function(error) {
    self.debug("EVENT_CALLER_ERROR %o", error.responseJSON);
    UIkit.notify({
      message: error.responseJSON.message,
      status: "warning",
      timeout: 4000,
      pos: "top-center"
    });
  });
	
}

Facade.STATE_404_ERROR = "error404";
Facade.STATE_INITIALIZE = "initialize";
Facade.STATE_LOGIN = "login";
Facade.STATE_HOMEPAGE = "homepage";
Facade.STATE_CAMPAIGN = "campaign";
Facade.STATE_ENTITY = "entity";