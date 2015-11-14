"use strict";

function Facade() {

	var self = this;
	riot.observable(self);

	self.version = '1.0.0';
	self.currentState = Facade.STATE_NULL;
	self.tags = {};
	self.individuals = [];
  self.configuration = {};
}

Facade.STATE_NULL = -1;
Facade.STATE_LOADING = 0;
Facade.STATE_HOMEPAGE = 1;