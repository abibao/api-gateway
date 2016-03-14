function Facade() {

	var self = this;
	riot.observable(self);

	self.version = "1.2.0";
	
  self.tags = {};
  self.stores = {
    auth: new AuthStore(),
    entities: new EntitiesStore()
  };
  self.actions = {
    auth: new AuthActions(self),
    entities: new EntitiesActions(self)
  };
  
  self.on("EVENT_RIOT_UPDATE", function() {
    console.log("EVENT_RIOT_UPDATE");
    riot.update();
  });
  
  self.on("EVENT_LOGIN_AUTH_COMPLETE", function() {
    if ( self.getCurrentState()===Facade.STATE_LOGIN ) { riot.route("/homepage"); }
    self.actions.entities.list().then(function(data) {
      console.log("EVENT_LOGIN_AUTH_COMPLETE", "entities", data);
      self.trigger("EVENT_RIOT_UPDATE");
    }).catch(function(error) {
      console.log("error", error);
      self.trigger("EVENT_LOGIN_AUTH_COMPLETE", "EVENT_RIOT_UPDATE", error);
    });
  });
  
  /** CURRENT ENTITY **/
  self._currentEntity = null;
  self.getCurrentEntity = function() {
    return self._currentEntity;
  };
  self.setCurrentEntity = function(value) {
    console.log("setCurrentEntity", value);
    self._currentEntity = _.clone(value);
    self.trigger("EVENT_RIOT_UPDATE");
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
      case "#entity":
        self.setCurrentState(Facade.STATE_ENTITY);
        var urn = window.location.hash.split("/")[1];
        self.actions.entities.read(urn).then(function(entity) {
          return facade.actions.entities.campaigns(urn).then(function(campaigns) {
            entity.campaigns = campaigns;
            self.setCurrentEntity(entity);
            Materialize.toast("Chargement \"entity\" effectuée", 4000, "light-green darken-2");
            self.tags["entity"].trigger("ENTITY_LOAD_COMPLETE");
          });
        })
        .catch(function(error) {
          self.setCurrentEntity(null);
          Materialize.toast(error.message, 4000, "deep-orange darken-3");
        });
        break;
      default:
        break;
    }
    // auth
    if ( facade.stores.auth.authentified() ) self.trigger("EVENT_LOGIN_AUTH_COMPLETE");
  };
  
}

Facade.Tags = 5; // sum of "_layout" and "views"
Facade.STATE_404_ERROR = "error404";
Facade.STATE_LOGIN = "login";
Facade.STATE_HOMEPAGE = "homepage";
Facade.STATE_ENTITY = "entity";