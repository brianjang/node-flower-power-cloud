var CloudAPI = require('./flower-power-cloud').CloudAPI;

var clientID     = 'bruno.sautron@parrot.com'
, clientSecret = 'C91omlFgZeug8RmuWhv2Ah1VefBFtGqCBmOvZbWZT1k0cM1I'
, userName     = 'bruno.sautron@parrot.com'
, passPhrase   = 'valerie974'
, api
;

api = new CloudAPI({
	clientID: clientID,
	clientSecret: clientSecret
});

api.login(userName, passPhrase, function(err) {
	if (!!err) return console.log('login error: ' + err.message);

	api.getGarden(function(err, sensors) {
		if (!!err) return console.log('getGarden: ' + err.message);

		console.log('sensors:'); console.log(sensors);
	});
});

api.on('error', function(err) { console.log('background error: ' + err.message); });
