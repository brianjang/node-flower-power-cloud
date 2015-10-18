var CloudAPI = require('./flower-power-cloud').CloudAPI;

var	clientID			= '...',
		clientSecret	= '...',
		userName			= '...',
		passPhrase		= '...',
		url						= '...',
		api;

api = new CloudAPI({
	clientID: clientID,
	clientSecret: clientSecret,
	url: url
});

api.login(userName, passPhrase, function(err) {
	if (!!err) return console.log('login error: ' + err.message);

	api.getGarden(function(err, sensors) {
		if (!!err) return console.log('getGarden: ' + err.message);

		console.log('sensors:'); console.log(sensors);
	});
});

api.on('error', function(err) { console.log('background error: ' + err.message); });
