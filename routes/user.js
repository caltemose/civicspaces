var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Space = mongoose.model('Space');

module.exports = function (app) {

  app.get('/me', loggedIn, function(req, res) {
    User.findById(req.session.user, function (err, user) {
      if (err) return next(err);
      if (!user) res.render('user/index.jade');
      else {
        Space.find({contact: user.id}, null, { limit: 25 }, function (err, spaces) {
          if (err) return next(err);
          res.render('user/index.jade', { user: user, spaces: spaces });
        });
      }
    })
  })

}
