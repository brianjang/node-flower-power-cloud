var FlowerPowerCloud = require('./FlowerPowerCloud');
var async = require('async');

var bruno = new FlowerPowerCloud();

var credential = {
      	'username'	: "parrottest.fpwebservice@gmail.com",
      	'password'	: "Parrot2015FP",
      	'client_id'	: "parrottest.fpwebservice@gmail.com",
      	'client_secret'	: "cvSjfnONllkHLymF2gEUL73PPXJiMMcVCd1VtZaIXHSGyhaT",
      	'grant_type'	: 'password',
      };

bruno.login(credential, function(err, res) {
	if (err) console.log(err);
	else {
		bruno.getGarden(function(err, res) {
			console.log(res);
		});
	}
});
