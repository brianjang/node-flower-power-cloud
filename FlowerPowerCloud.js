import ApiError from './ApiError';
let async = require('async');
let request = require('request');
let qs = require('querystring');
let clc = require('cli-color');
let schedule = require('node-schedule');

const DEBUG = true;
const URL = 'https://apiflowerpower.parrot.com';

export default class FlowerPowerCloud {
	constructor() {
		this._token = {};
		this._isLogged = false;
		this.credentials = {};
		this.autoRefresh = false;

		let methods = {
			'getSyncGarden': {method: 'GET/json', path: '/sensor_data/v4/garden_locations_status', auth: true},
			'getProfile': {method: 'GET/json', path: '/user/v4/profile', auth: true},
			'sendSamples': {method: 'PUT/json', path: '/sensor_data/v5/sample', auth: true},
			'getSyncData': {method: 'GET/json', path: '/sensor_data/v3/sync', auth: true}
		};

		for (let name in methods) {
			this[name] = data => this.invoke(methods[name], data);
		}
		return (this);
	}

	get token() {
		return (this._token);
	}

	get isLogged() {
		return (this._isLogged);
	}

	loggerReq(req, url, data) {
		console.log(clc.yellow(req.method), clc.green(url));
		for (var key in data) {
			console.log(clc.xterm(45)(clc.underline(key + ":"), data[key]));
		}
	}
	makeUrl(path, uri) {
		// /.../:arg1/:arg2
		return (URL + path);
	}

	makeHeader(method, url, param) {
		let options = {headers: {}};
		let verb = method.method.split('/')[0];
		let type = method.method.split('/')[1];

		switch (type) {
			case 'urlencoded':
			options.body = qs.stringify(param);
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			break;
			case 'json':
			options.body = JSON.stringify(param);
			options.headers['Content-Type'] = 'application/json';
			break;
			default:
			options.body = param;
			options.headers['Content-Type'] = 'text/plain';
			break;
		}

		options.url = url;
		options.method = verb;
		options.headers['Authorization'] = (method.auth) ? "Bearer " + this._token.access_token : "";

		return (options);
	}

	concatJson(json1, json2) {
		let dest = json1;

		for (let key in json2) {
			if (typeof json1[key] == 'object' && typeof json2[key] == 'object') {
				dest[key] = this.concatJson(json1[key], json2[key]);
			}
			else {
				dest[key] = json2[key];
			}
		}
		return dest;
	}

	invoke(method, {uri, param}) {
		return new Promise((resolve, reject) => {
			let url = this.makeUrl(method.path, uri);
			let options = this.makeHeader(method, url, param);

			if (DEBUG) this.loggerReq(method, url, options);
			request(options, (err, res, body) => {
				if (err) reject(err);
				else {
					if (typeof body == 'string') body = JSON.parse(body);
					if (res.statusCode != 200 || (body.errors && body.errors.length > 0)) {
						reject(new ApiError(res.statusCode, body), null);
					}
					else {
						let results = body;

						if (results.sensors) {
							let sensors = {};
							for (let sensor of results.sensors) {
								if (sensor.sensor_serial) sensors[sensor.sensor_serial] = sensor;
							}
							results.sensors = sensors;
						}
						if (results.locations) {
							let locations = {};
							for (let location of results.locations) {
								if (location.sensor_serial) locations[location.sensor_serial] = location;
							}
							results.locations = locations;
						}
						if (results.sensors && results.locations) {
							results.sensors = this.concatJson(results.sensors, results.locations);
							delete results.locations;
						}
						resolve(results);
					}
				}
			});
		});
	}

	setToken(token) {
		this._token = token;
		this._isLogged = true;

		if (this.autoRefresh) {
			let job = new schedule.Job(() => {
				this.refresh(token);
			});
			job.schedule(new Date(Date.now() + (token['expires_in'] - 1440) * 1000));
		}
	}

	refresh(token) {
		let req = {method: 'POST/urlencoded', path: '/user/v2/authenticate'};

		let data = {
			'client_id':	this.credentials['client_id'],
			'client_secret': this.credentials['client_secret'],
			'refresh_token': token.refresh_token,
			'grant_type': 'refresh_token'
		};
		this.invoke(req, {param: data}).then(token => {
			this.setToken(token);
		});
	}

	login(data) {
		return new Promise((resolve, reject) => {
			let req = {method: 'POST/urlencoded', path: '/user/v2/authenticate'};

			if (data['auto-refresh']) {
				this.autoRefresh = data['auto-refresh'];
				delete data['auto-refresh'];
			}

			this.credentials = data;
			data['grant_type'] = 'password';
			this.invoke(req, {param: data}).then(token => {
				this.setToken(token);
				resolve(token);
			}).catch(err => {
				reject(err);
			});
		});
	}

	getGarden(data) {
		return new Promise((resolve, reject) => {
			Promise.all([
				this.getSyncData({}),
				this.getSyncGarden({})
			]).then(res => {
				resolve(this.concatJson(res[0], res[1]));
			}).catch(err => {
				reject(err);
			});
		});
	}
}
