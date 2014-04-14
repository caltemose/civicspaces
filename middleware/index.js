var path = require('path');
var express = require('express');
var MongoStore = require('connect-mongo')(express);

module.exports = function (app, CONFIG) {
  app.use(express.logger('dev'));
  //app.use(logfmt.requestLogger()); //heroku log format

  //static files
  app.use(express.static( path.join(__dirname, '../public')));

  // handle sessions and store them in mongo
  var secret = 'asCJ37c8-!jCcl-Fjl2*74c98#-dbJ3L1348^1@#8djkl';
  var db = 'csproto';
  var hour = 3600000;
  app.use(express.cookieParser());
  app.use(express.session({
    secret: secret, 
    store: new MongoStore({
      db: db
    }),
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
