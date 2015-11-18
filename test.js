import FlowerPowerCloud from './FlowerPowerCloud';

let bruno = new FlowerPowerCloud();
let async = require('async');

let credential = {
      	'username'	: "parrottest.fpwebservice@gmail.com",
      	'password'	: "Parrot2015FP",
      	'client_id'	: "parrottest.fpwebservice@gmail.com",
      	'client_secret'	: "cvSjfnONllkHLymF2gEUL73PPXJiMMcVCd1VtZaIXHSGyhaT",
      	'grant_type'	: 'password',
      };

bruno.login(credential, function(res) {
  async.series([
    function(callback) {
      bruno.getProfile(callback)
    },
    function(callback) {
      bruno.getGarden(callback);
    }
  ],
  function(err, res) {
	  console.log(res);
  });
});
