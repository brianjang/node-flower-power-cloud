let request = require('request');
let qs = require('querystring');
let clc = require('cli-color');

let content = {
  'json': 'application/json',
  'text': 'text/plain',
  'urlencoded': 'application/x-www-form-urlencoded'
};

export default class FlowerPowerCloud {
  constructor() {
    this._token = {};

    let api = {
      'login': {method: 'POST/urlencoded', path: '/user/v2/authenticate'},
      'getGarden': {method: 'GET/json', path: "/sensor_data/v4/garden_locations_status", auth: true},
      'getProfile': {method: 'GET/json', path: "/user/v4/profile", auth: true},
      'sendSamples': {method: 'PUT/json', path: '/sensor_data/v5/sample',  auth: true}
    };

    for (var item in api) {
      let req = api[item];
      let name = item;

      this[item] = (data, callback) => {
        console.log(clc.yellow(req.method), clc.green(req.path));

        if (typeof data == 'function') {
          callback = data;
          data = null;
        }

        let body = qs.stringify(data);
        let options = {};

        options.url = FlowerPowerCloud.url + req.path,
        options.method = req.method.split('/')[0];
        options.body = (!!data) ? body : "",
        options.json = true;
        options.headers = {
          'Content-Type': content[req.method.split('/')[1]],
          'Content-length' : (!!data) ? body.length : 0,
          'Authorization': (req.auth) ? "Bearer " + this._token.access_token : "",
        };

        console.log(options);
        request(options, (err, res, body) => {
          if (err) throw err;
          else if (res.statusCode != 200) throw res.statusCode + ": " + body;
          else if (callback) {
            if (name == 'login' || name == 'refresh') this._token = body;
            callback(err, body);
          }
          else throw "Give me a callback";
        });
      };
    }
    return this;
  }
};

FlowerPowerCloud.url = 'https://apiflowerpower.parrot.com';
