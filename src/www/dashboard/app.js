var socket = io('http://gperreymond-abibao.c9.io');

var tags = [
  'homepage/index.tag',
  'homepage/components/dg-entities.tag',
  'components/navbar.tag',  
  'components/login.tag',
  'components/error404.tag'
];

var facade = new Facade();

async.map(tags, function(item, callback) {
  
  // preloading tags
  riot.compile(item, function() {
	  callback(null, item);
	});
	
}, function(err, results) {
  
  // mount all tags
  riot.mount('*', facade);
  
  // setup routing
  riot.route('/homepage', function(name) { console.log('/homepage', name); facade.setCurrentState(Facade.STATE_HOMEPAGE); });
  riot.route('/login', function(name) { console.log('/login', name); facade.setCurrentState(Facade.STATE_LOGIN); });
  riot.route('/*', function() { console.log('/*', name); facade.setCurrentState(Facade.STATE_404_ERROR); });
  
});