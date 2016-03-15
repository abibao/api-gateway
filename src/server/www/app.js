var tags = [
  "views/homepage/index.tag",
  "views/homepage/components/homepageEntitiesDataGrid.tag",
  "views/homepage/renderers/homepageEntitiesItemRenderer.tag",
  "views/entity/index.tag",
  "views/entity/components/entityCampaignsDataGrid.tag",
  "views/entity/renderers/entityCampaignsItemRenderer.tag",
  "views/campaign/index.tag",
  "views/campaign/components/campaignItemDataGrid.tag",
  "views/campaign/renderers/campaignItemItemRenderer.tag",
  "views/login/index.tag",
  "views/_layouts/navbar.tag",  
  "views/_layouts/error404.tag",
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