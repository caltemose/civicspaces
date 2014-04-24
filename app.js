var mongoose = require('mongoose');
var express = require('express');

// add mongoose query and promise support to express
require('express-mongoose');

// @TODO prod/dev environment setup

// @TODO add session stuff: db name, session secret, cookie maxAge
var CONFIG = {
  host: 'http://localhost',
  port: Number(process.env.PORT || 3000),
  dbUri: 'mongodb://localhost/csproto'
}
mongoose.set('debug', true);

var models = require('./models');
var routes = require('./routes');
var middleware = require('./middleware');

mongoose.connect(CONFIG.dbUri, function (err) {
  if (err) throw err;
  
  console.log(CONFIG.port);

  var app = express();
  middleware(app, CONFIG);
  routes(app, CONFIG);

  app.listen(CONFIG.port, function () {
    console.log('CivicSpaces Server running on port ' + CONFIG.port);
  })
})