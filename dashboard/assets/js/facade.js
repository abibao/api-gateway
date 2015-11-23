"use strict";

function Facade() {
  
  /**
   * GLOBAL
   **/
  
	var self = this;
	riot.observable(self);

	self.version = '1.0.0';
	self.currentState = window.location.pathname;
	self.tags = {};
	
  self.configuration = {
  	primaryColor: 'light-green-text text-darken-2'
  };
  
  self.administrator = null;
}

Facade.STATE_NULL = -1;
Facade.STATE_HOMEPAGE = '/dashboard/index.html';
Facade.STATE_INDIVIDUALS = '/dashboard/individuals.html';