function AuthActions(facade) {

	var self = this;
	
	self.login = function(payload) {
    console.log("AuthActions.login");
    return new Promise(function(resolve, reject) {
      // Resolve 
      var jqxhr = $.post("/v1/administrators/login", payload, function(data) {
        jqxhr.hasError = false;
      })
      .fail(function(error) {
        jqxhr.hasError = true;
      })
      .done(function(data) {
      })
      .always(function(data) {
        Cookies.set("Authorization", data.token);
      });
      // Set another completion function for the request above
      jqxhr.complete(function(data) {
        console.log("global complete", jqxhr.hasError, data);
        if (jqxhr.hasError) {
          facade.trigger("EVENT_LOGIN_AUTH_ERROR", data);
          reject(data);
        } else {
          facade.trigger("EVENT_LOGIN_AUTH_COMPLETE", data);
          resolve(data);
        }
      });
    });
	};
	
}