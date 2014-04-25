var mongoose = require('mongoose');
var express = require('express');

// add mongoose query and promise support to express
require('express-mongoose');

// @TODO prod/dev environment setup


var CONFIG = {
  // @TODO CONFIG.host needs to be an ENV variable
  host: 'http://localhost',
  port: Number(process.env.PORT || 3000),
  dbUri: process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL || 'mongodb://localhost/csproto'
}
mongoose.set('debug', true);

var models = require('./models');
var routes = require('./routes');
var middleware = require('./middleware');

mongoose.connect(CONFIG.dbUri, function (err) {
  if (err) throw err;

  var app = express();
  middleware(app, CONFIG);
  routes(app, CONFIG);

  app.listen(CONFIG.port, function () {
    console.log('CivicSpaces Server running on port ' + CONFIG.port);
  })
})