var errors = require('./errors');
var setup = require('./setup');
var login = require('./login');
var password = require('./password');
var statics = require('./statics');
var user = require('./user');
var spaces = require('./spaces');
var api = require('./api');
var mongoose = require('mongoose');
//var BlogPost = mongoose.model('BlogPost');

module.exports = function (app, CONFIG) {

  // home page
  app.get('/', function (req, res, next) {
    // BlogPost.find().sort('created').limit(10).exec(function (err, posts) {
    //   if (err) return next(err);
    //   res.render('home.jade', { posts: posts });
    // })
    res.render('home.jade');
  })

  //development only
  setup(app);

  // login / logout routes
  login(app);

  // password lost/reset
  password(app, CONFIG);

  // public static pages
  statics(app);

  // user account pages
  user(app);

  // space CRUD
  spaces(app, CONFIG);

  // API routes
  api(app, CONFIG);

  // error handlers
  errors(app);
}
