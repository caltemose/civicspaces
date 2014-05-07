var mongoose = require('mongoose');
var User = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function (app) {

  app.get('/signup', function (req, res) {
    var data = {};
    if (req.session.followup) {
      data.followup = req.session.followup;
      req.session.followup = null;
    }
    res.render('signup.jade', data);
  });

  // create new account
  app.post('/signup', function (req, res, next) {
    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
    var name = cleanString(req.param('name'));
    var phone = cleanString(req.param('phone'));
    var followup = req.param('followup');

    if (!(email && pass && name && phone)) {
      return invalid();
    }

    User.findById(email, function (err, user) {
      if (err) return next(err);

      if (user) {
        return res.render('signup.jade', { exists: true });
      }

      crypto.randomBytes(16, function (err, bytes) {
        if (err) return next(err);

        var user = { _id: email };
        user.salt = bytes.toString('utf8');
        user.hash = hash(pass, user.salt);
        user.name = name;
        user.phone = phone;

        User.create(user, function (err, newUser) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            } 
            return next(err);
          }

          // user created successfully
          req.session.isLoggedIn = true;
          req.session.user = email;
          console.log('created user: %s', email);
          var redirectUrl = '/';
          if (followup) redirectUrl = followup;
          return res.redirect(redirectUrl);
        })
      })
    })

    function invalid () {
      return res.render('signup.jade', { invalid: true });
    }
  });

  
  app.get('/login', function (req, res) {
    var followup = req.param('followup');
    var data = {};
    if (followup) data.followup = followup;
    res.render('login.jade', data);
  })

  app.post('/login', function (req, res, next) {
    // validate input
    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
    var followup = req.param('followup');
    if (!(email && pass)) {
      return invalid();
    }

    // user friendly
    email = email.toLowerCase();

    // query mongodb
    User.findById(email, function (err, user) {
      if (err) return next(err);

      if (!user) {
        return invalid();
      }

      // check pass
      if (user.hash != hash(pass, user.salt)) {
        return invalid();
      }

      req.session.isLoggedIn = true;
      req.session.user = email;
      var redirectUrl = '/';
      if (followup) redirectUrl = followup;
      res.redirect(redirectUrl);
    })

    function invalid () {
      return res.render('login.jade', { invalid: true });
    }
  })

  app.get('/logout', function (req, res) {
    req.session.isLoggedIn = false;
    req.session.user = null;
    res.redirect('/');
  })
}
