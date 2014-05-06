var path = require('path');
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var logfmt = require("logfmt");

module.exports = function (app, CONFIG) {
  app.use(express.logger('dev'));
  app.use(logfmt.requestLogger()); //heroku log format

  //static files
  app.use(express.static( path.join(__dirname, '../public')));
  
  //sessions
  app.use(express.cookieParser());
  var hour = 3600000;
  var store;

  if (CONFIG.dbUri.indexOf('localhost') > -1)
    store = {db:CONFIG.localDb}
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
    secret: CONFIG.secret, 
    store: new MongoStore(store),
    cookie: {
      maxAge: 48*hour
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
