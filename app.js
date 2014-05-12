var mongoose = require('mongoose');
var express = require('express');

// add mongoose query and promise support to express
require('express-mongoose');

var CONFIG = {
  host: process.env.HOST || 'http://localhost',
  port: Number(process.env.PORT || 3000),
  dbUri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/csproto',
  localDb: process.env.LOCAL_DB || 'csproto',
  secret: process.env.SECRET || 'asCJ37c8-jCclFjl2*74c98#dbJ3L1348^1@#8djkl',
  mandrillKey: process.env.MANDRILL_KEY || null,
  awsKey: process.env.AWS_KEY || null,
  awsSecret: process.env.AWS_SECRET || null,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD || null,
  cloudinaryKey: process.env.CLOUDINARY_KEY || null,
  cloudinarySecret: process.env.CLOUDINARY_SECRET || null
}

// @TODO prod/dev environment setup
mongoose.set('debug', true);

var models = require('./models');
var routes = require('./routes');
var middleware = require('./middleware');

// @TODO fix CONFIG.dbURI override
// if (CONFIG.host === 'http://localhost')
//   CONFIG.dbUri = 'mongodb://localhost/csproto';

mongoose.connect(CONFIG.dbUri, function (err) {
  if (err) throw err;

  var app = express();
  middleware(app, CONFIG);
  routes(app, CONFIG);

  app.listen(CONFIG.port, function () {
    console.log('CivicSpaces Server running on port ' + CONFIG.port);
  })
})