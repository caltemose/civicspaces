var path = require('path');
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var logfmt = require("logfmt");

module.exports = function (app, CONFIG) {
  app.use(express.logger('dev'));
  app.use(logfmt.requestLogger()); //heroku log format

  //static files
  app.use(express.static( path.join(__dirname, '../public')));
  //var test = 'mongodb://user:pass@ds031747.mongolab.com:31747/heroku_app24489443'
  // handle sessions and store them in mongo
  var secret = 'asCJ37c8-!jCcl-Fjl2*74c98#-dbJ3L1348^1@#8djkl';
  var db = 'csproto';
  var hour = 3600000;
  app.use(express.cookieParser());
  //app.use(express.session({secret: secret}));
  var store;

  if (CONFIG.dbUri.indexOf('localhost') > -1)
    store = {db:db}
  else {
    store = {}
    var halves = CONFIG.dbUri.split('@')
    var first = halves[0].split(':')
    store.username = first[1].replace('//', '')
    store.password = first[2];
    var second = halves[1].split(':')
    store.host = second[0];
    var third = second[1].split('/');
    store.port = third[0];
    store.db = third[1];
  }

  app.use(express.session({
    secret: secret, 
    store: new MongoStore(store),
    cookie: {
      maxAge: hour
    }
  }));

  app.use(express.urlencoded());

  app.locals.sitetitle = 'CivicSpaces';

  // expose session to views
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  })
}
