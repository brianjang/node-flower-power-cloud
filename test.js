var CloudAPI = require('./flower-power-cloud').CloudAPI;

var clientID     = 'parrottest.fpwebservice@gmail.com'
, clientSecret = 'cvSjfnONllkHLymF2gEUL73PPXJiMMcVCd1VtZaIXHSGyhaT'
, userName     = 'parrottest.fpwebservice@gmail.com'
, passPhrase   = 'Parrot2015FP'
, api
;

api = new CloudAPI({
	clientID: clientID,
	clientSecret: clientSecret
});

api.login(userName, passPhrase, function(err) {
	if (!!err) return console.log('login error: ' + err.message);

	api.getGarden(function(err, plants, sensors) {
		if (!!err) return console.log('getGarden: ' + err.message);

		console.log('plants:'); console.log(plants);
		console.log('sensors:'); console.log(sensors);
	});
});

api.on('error', function(err) { console.log('background error: ' + err.message); });
