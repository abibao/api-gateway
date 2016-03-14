function EntitiesActions(facade) {

	var self = this;
	
	self.update = function(payload) {
	  var dataToSave = _.clone(payload);
	  delete dataToSave.createdAt;
	  delete dataToSave.modifiedAt;
	  delete dataToSave.urn;
	  delete dataToSave.campaigns;
    console.log("EntitiesActions.save", dataToSave);
    return new Promise(function(resolve, reject) {
      // Headers
      $.ajaxSetup({
        headers: { 'Authorization': Cookies.get("Authorization") }
      });
      // Resolve 
      var jqxhr = $.ajax({
        method: "PATCH",
        url: "/v1/entities/"+payload.urn,
        data: dataToSave
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
        console.log("global complete", jqxhr.hasError, data);
        if (jqxhr.hasError) {
          facade.trigger("EVENT_UPDATE_ENTITY_ERROR", data);
          reject(data);
        } else {
          facade.trigger("EVENT_UPDATE", data);
          resolve(data);
        }
      });
    });
	};
	
	self.read = function(urn) {
    console.log("EntitiesActions.read", urn);
    return new Promise(function(resolve, reject) {
      // Headers
      $.ajaxSetup({
        headers: { 'Authorization': Cookies.get("Authorization") }
      });
      // Resolve 
      var jqxhr = $.getJSON("/v1/entities/"+urn, function(data) {
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
        console.log("global complete", jqxhr.hasError, data);
        if (jqxhr.hasError) {
          facade.trigger("EVENT_READ_ENTITY_ERROR", data);
          reject(data);
        } else {
          facade.trigger("EVENT_RIOT_UPDATE", data);
          resolve(data);
        }
      });
    });
	};
	
	self.list = function(payload) {
    console.log("EntitiesActions.list");
    return new Promise(function(resolve, reject) {
      // Headers
      $.ajaxSetup({
        headers: { 'Authorization': Cookies.get("Authorization") }
      });
      // Resolve 
      var jqxhr = $.getJSON("/v1/entities", function(data) {
        jqxhr.hasError = false;
      })
      .fail(function(error) {
        jqxhr.hasError = true;
      })
      .done(function(data) {
      })
      .always(function(data) {
        facade.stores.entities.charities = _.filter(data, function(item) {
          return (item.type==="charity");
        });
        facade.stores.entities.companies = _.filter(data, function(item) {
          return (item.type==="company" || item.type==="abibao");
        });
      });
      // Set another completion function for the request above
      jqxhr.complete(function(data) {
        console.log("global complete", jqxhr.hasError, data);
        if (jqxhr.hasError) {
          facade.trigger("EVENT_INITIALIZE_ENTITIES_ERROR", data);
          reject(data);
        } else {
          facade.trigger("EVENT_RIOT_UPDATE", data);
          resolve(data);
        }
      });
    });
	};
	
	self.campaigns = function(urn) {
    console.log("EntitiesActions.campaigns", urn);
    return new Promise(function(resolve, reject) {
      // Headers
      $.ajaxSetup({
        headers: { 'Authorization': Cookies.get("Authorization") }
      });
      // Resolve 
      var jqxhr = $.getJSON("/v1/entities/"+urn+'/campaigns', function(data) {
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
        console.log("global complete", jqxhr.hasError, data);
        if (jqxhr.hasError) {
          facade.trigger("EVENT_READ_ENTITY_CAMPAIGNS_ERROR", data);
          reject(data);
        } else {
          facade.trigger("EVENT_RIOT_UPDATE", data);
          resolve(data);
        }
      });
    });
	};
	
}