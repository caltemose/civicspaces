var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app) {

  app.get('/password/lost', function (req, res) {
    res.render('password/lost.jade');
  });

  app.post('/password/lost', function(req, res) {
    var email = req.params('email');
    if (!email) return res.render('password/lost.jade', {noEmail:true});
    User.findById(email, function (err, user) {
      if (err) return next(err);
      if (!user) return res.render('password/lost.jade', {noUser:true});
      else {
        return res.render('password/lost-results.jade', {user:user});
      }
    })
  })

}