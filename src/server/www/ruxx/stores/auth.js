function AuthStore() {

	var self = this;
	riot.observable(self);
	
	self.dataProvider = [];
	
  self.authentified = function() {
    var ca = Cookies.get("Authorization");
    return _.isUndefined(ca)===false;
  };
  
}