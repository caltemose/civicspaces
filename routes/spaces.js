var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Space = mongoose.model('Space');

module.exports = function (app) {

  app.get('/space/view/:id', function(req, res) {
    Space.findById(req.param('id'), function(err, space) {
      if (err) return next(err);
      // @TODO if no space found, handle error appropriately
      if (!space) return next();
      res.render('space/view.jade', {space: space});
    })
  })

  app.get('/space/create', function (req, res) {
    if (req.session.isLoggedIn) {
      res.render('space/create.jade');  
      // var query = User.findById(req.session.user);
      // query.exec(function(err, user) {
      //   if (err) return next(err);
      //   if (!user) return next();
      //   res.render('space/create.jade');  
      // })
    } else res.redirect('/signup');
  });

  app.post('/space/create', loggedIn, function(req, res) {
    var data = {
      address: req.param('address'),
      city: req.param('city'),
      zip: req.param('zip'),
      terms: req.param('terms'),
      author: req.session.user
    }

    //reject if no terms
    // @TODO add error specificity
    if (!data.terms)
      return res.render('space/create.jade', { invalid: true, formdata: data });

    // @TODO validate zip

    Space.create({
      contact: data.author,
      address: data.address,
      city: data.city,
      zip: data.zip
    }, function(err, space) {
      if (err) return next(err);
      // @TODO if no space created, handle error appropriately
      if (!space) return next();
      res.redirect('/space/edit/' + space.id);
    })

  })

  app.get('/space/edit/:id', loggedIn, function(req, res) {
    Space.findById(req.param('id'), function(err, space) {
      if (err) return next(err);
      // @TODO if no space found, handle error appropriately
      if (!space) return next();
      res.render('space/edit.jade', { space: space });
    })
  })

  app.post('/space/edit/:id', loggedIn, function(req, res) {
    var address = req.param('address');
    var zip = req.param('zip');
    if(address === '' || zip === '') {
      Space.findById(req.param('id'), function(err, space) {
        if (err) return next(err);
        if (!space) return next();
        return res.render('space/edit.jade', {noAddressZip:true, space:space})
      })
    } else {
      Space.edit(req, function(err) {
        if (err) return next(err);
        res.redirect('/space/edit/' + req.param('id'));
      })
    }
  })

  app.get('/space/list', function(req, res) {
    Space.find({}, null, { limit: 25 }, function (err, spaces) {
      if (err) return next(err);
      if (!spaces) return next();
      return res.render('space/list.jade', {spaces: spaces});
    });
  })

}