var FlowerPowerCloud = require('./FlowerPowerCloud');

var api = new FlowerPowerCloud("...");
var credentials = {
	"client_id": "...",
	"client_secret": "...",
	"username": "...",
	"password": "..."
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
