function Facade() {

	var self = this;
	riot.observable(self);

	self.version = '1.0.5';
	
  self.tags = {};
  
  self.authentified = function() {
    var ca = Cookies.get('Authentification');
    return _.isUndefined(ca)===false;
  };
  
  self._currentState = Facade.STATE_HOMEPAGE;
  self.getCurrentState = function() {
    return self._currentState;
  };
  self.setCurrentState = function(state) {
    console.log('setCurrentState', state);
    self._currentState = state;
    riot.update();
  };
  
  self.start = function() {
    console.log('start facade');
    riot.route.start(true);
  };
  
}

Facade.Tags = 4;
Facade.STATE_404_ERROR = 'error404';
Facade.STATE_HOMEPAGE = 'homepage';
Facade.STATE_LOGIN = 'login';