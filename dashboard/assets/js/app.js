"use strict";

var facade = new Facade();

var tags = [
  'components/s-individuals-shortlist.tag',
  'components/s-menus.tag',
];

async.map(tags, function(item, callback) {
  // preloading tags
  riot.compile(item, function() {
		callback(null, item);
	});
}, function(err, results){
  // starting application
  console.log(results);
	riot.mount('*', facade);
});