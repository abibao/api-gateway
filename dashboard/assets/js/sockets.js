"use strict";

$(function() {
  
  var socket = io.connect('https://gperreymond-abibao.c9.io');
	
	socket.on('IndividualCreated', function(data) {
		console.log('Socket', 'IndividualCreated', data);
		facade.tags['s-individuals-shortlist'].trigger('SocketIndividualCreated', data);
	});
	
	socket.on('IndividualUpdated', function(data) {
		console.log('Socket', 'IndividualUpdated', data);
		facade.tags['s-individuals-shortlist'].trigger('SocketIndividualUpdated', data);
	});
	
});