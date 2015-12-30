import FlowerPowerCloud from './FlowerPowerCloud';

let async = require('async');

let api = new FlowerPowerCloud();

let credentials = {
	'username'		: "...",
	'password'		: "...",
	'client_id'		: "...",
	'client_secret'	: "...",
	'auto-refresh'	: false
};

api.login(credentials).then((res) => {
	return api.getGarden({});
}).then(res => {
	console.log(res);
}).catch(err => {
	console.error(err);
});
