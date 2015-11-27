var ApiError = require('./ApiError');
var request = require('request');
var qs = require('querystring');
var clc = require('cli-color');
var async = require('async');

var DEBUG = false;

function loggerReq(req, data) {
  console.log(clc.yellow(req.method), clc.green(req.path));
  for (var key in data) {
    console.log(clc.xterm(45)(clc.underline(key + ":"), data[key]));
  }
}

function concatJson(json1, json2) {
  var dest = json1;

  for (var key in json2) {
    if (typeof json1[key] == 'object' && typeof json2[key] == 'object') {
      dest[key] = concatJson(json1[key], json2[key]);
    }
    else {
      dest[key] = json2[key];
    }
  }
  return dest;
}

function FlowerPowerCloud(url) {
  this.url = url;
  this._token = {};
  this._isLogged = false;

  var self = this;
  var api = {
    'login': {method: 'POST/urlencoded', path: '/user/v3/authenticate'},
    'getProfile': {method: 'GET/urlencoded', path: "/user/v4/profile", auth: true},
    'getGardenConfig': {method: 'GET/urlencoded', path: "/garden/v2/configuration", auth: true},
    'getGardenStatus': {method: 'GET/urlencoded', path: "/garden/v1/status", auth: true},
    'sendGardenStatus': {method: 'PUT/json', path: "/garden/v1/status", auth: true},
    'sendSamples': {method: 'PUT/json', path: '/sensor_data/v8/sample',  auth: true}
  };

  for (var item in api) {
    self.makeReqFunction(api[item], item);
  }
  return this;
}

FlowerPowerCloud.prototype.makeReqFunction = function (req, name) {
  var self = this;

  FlowerPowerCloud.prototype[name] = function(data, callback) {
    var options = {};

    if (typeof data == 'function') {
      callback = data;
      data = null;
    }

    req = self.makeUrl(req, data);
    options = self.makeHeader(req, data);

    if (DEBUG) console.log(options);
    request(options, function(err, res, body) {
      if (err) callback(err);
      else if (res.statusCode != 200 || (typeof body.errors != 'undefined' && body.errors.length > 0)) {
        return callback(new ApiError(res.statusCode, JSON.parse(body)));
      }
      else if (callback) {
        if (name == 'login' || name == 'refresh') {
          self._token = JSON.parse(body);
          self._isLogged = true;
        }
        return callback(null, JSON.parse(body));
      }
      else throw "Give me a callback";
    });
  };
};

FlowerPowerCloud.prototype.makeHeader = function(req, data) {
  var options = {headers: {}};
  var verb = req.method.split('/')[0];
  var type = req.method.split('/')[1];

  switch (type) {
    case 'urlencoded':
    options.body = qs.stringify(data);
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    break;
    case 'json':
    options.body = JSON.stringify(data);
    options.headers['Content-Type'] = 'application/json';
    break;
    default:
    options.body = data;
    options.headers['Content-Type'] = 'text/plain';
    break;
  }

  options.url = this.url + req.path,
  options.method = verb;
  options.headers['Authorization'] = (req.auth) ? "Bearer " + this._token.access_token : "";

  return options;
}

FlowerPowerCloud.prototype.makeUrl = function(req, data) {
  if (data) {
    for (var item in data.url) {
      req.path = req.path.replace(':' + item, data.url[item]);
    }
    delete data.url;
  }
  if (DEBUG) loggerReq(req, data);
  return req;
}

FlowerPowerCloud.prototype.getGarden = function(callback) {
  var self = this;

  async.series({
    configuration: function(callback) {
      self.getGardenConfig(callback);
    },
    status: function(callback) {
      self.getGardenStatus(callback);
    }
  }, function(error, results) {
    if (!error) {
      var sensors = {};
      results = concatJson(results.status, results.configuration);

      for (var i in results.locations) {
        if (results.locations[i].sensor) {
          sensors[results.locations[i].sensor.sensor_identifier] = results.locations[i];
        }
      }
      delete results.locations;
      results.sensors = sensors;
      callback(null, results);
    }
    else callback(error);
  });
}

module.exports = FlowerPowerCloud;
