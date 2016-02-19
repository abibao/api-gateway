function Facade() {

	var self = this;
	riot.observable(self);

	self.version = '1.0.0';
	self.currentState = Facade.STATE_HOMEPAGE;
  
  self.tags = {};
  
  self.setCurrentState = function(state) {
    console.log('setCurrentState', state);
    self.currentState = state;
    self.tags[state].trigger('ready');
    self.tags['navbar'].trigger('ready');
    _.map(self.tags,function(item){item.update()});
  };
  
  self.start = function() {
    console.log('start facade');
    // start routing
    riot.route.start(true);
  };
  
}

Facade.Tags = 4;
Facade.STATE_404_ERROR = 'error404';
Facade.STATE_HOMEPAGE = 'homepage';
Facade.STATE_LOGIN = 'login';