var FlowerPowerCloud = require('./FlowerPowerCloud');

var api = new FlowerPowerCloud();
var credentials = {
	"grant_type": "",
	"client_id": "",
	"client_secret": "",
	"username": "",
	"password": "",
	"app_identifier": ""
};

api.login(credentials, function(err, res) {
	if (err) console.log(err.toString());
	else {
		api.getGarden(function(err, res) {
			console.log(err);
			console.log(res);
		});
	}
});
