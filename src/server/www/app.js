var tags = [
  "views/modules/login.tag",
  "views/modules/homepage.tag",
  "views/modules/entity.tag",
  "views/campaign/index.tag",
  "views/_layouts/loading.tag",  
  "views/_layouts/error404.tag",
  "views/_layouts/facade.tag"
];

var facade = new Facade();

async.map(tags, function(item, callback) {
  
  // preloading tags
  riot.compile(item, function() {
	  callback(null, item);
	});
	
}, function(err, results) {
  
  // mount all tags
  riot.mount("*", facade);
  
  // setup routing
  riot.route("/homepage", function() { facade.setCurrentState(Facade.STATE_HOMEPAGE); });
  riot.route("/campaign/*", function() { facade.setCurrentState(Facade.STATE_CAMPAIGN); });
  riot.route("/entity/*", function() { facade.setCurrentState(Facade.STATE_ENTITY); });
  riot.route("/login", function() { facade.setCurrentState(Facade.STATE_LOGIN); });
  riot.route("/*", function() { facade.setCurrentState(Facade.STATE_404_ERROR); });
  
});