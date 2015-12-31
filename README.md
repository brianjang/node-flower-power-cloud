# flower-power-api

[![NPM](https://nodei.co/npm/flower-power-api.png)](https://nodei.co/npm/flower-power-api/)    


A node.js module to interface with the [cloud service](https://github.com/parrot-flower-power/parrot-flower-power-api-example)
for the Parrot [Flower Power](http://www.parrot.com/flowerpower/).

## Get your access API
* `username` `password`
	* Make sure you have an account created by your smartphone. You should be see your garden: [myflowerpower.parrot.com](https://myflowerpower.parrot.com).
* `client_id` `client_secret`
	* [Sign up to API here](https://apiflowerpower.parrot.com/api_access/signup), and got by **email** your *Access ID* (`client_id`) and your *Access secret* (`client_secret`).

## API
### Load
```js
import FlowerPowerCloud from './FlowerPowerCloud'
let api = new FlowerPowerCloud();
```

### Login to cloud
```js
let credential = {
	'username'		: "...",
	'password'		: "...",
	'client_id'		: "...",
	'client_secret'	: "...",
	'auto-refresh'  : false
};

api.login(credential).then(res => {
    return api.getGarden({});
}).then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});
```

### Communicate with Cloud
Every method have the same pattern:
```js
let data = {param, uri};
api.methodName(data)
    .then(res)
    .catch(err);

// Call them
api.getGarden({});
api.getSyncGarden({});
api.getSyncData({});
api.getProfile({});
api.sendSamples({param});

// More details into ./FlowerPowerCloud.js
let api = {
    'getSyncGarden': {method: 'GET/json', path: '/sensor_data/v4/garden_locations_status', auth: true},
    'getProfile': {method: 'GET/json', path: '/user/v4/profile', auth: true},
    'sendSamples': {method: 'PUT/json', path: '/sensor_data/v5/sample', auth: true},
    'getSyncData': {method: 'GET/json', path: '/sensor_data/v3/sync', auth: true}
};
```

## Finally
Enjoy!
