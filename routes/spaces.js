var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Space = mongoose.model('Space');
var cloudinary = require('cloudinary');

module.exports = function (app, CONFIG) {

  app.get('/space/cloudinary', function(req, res) {
    cloudinary.config({
      cloud_name: CONFIG.cloudinaryCloud,
      api_key: CONFIG.cloudinaryKey,
      api_secret: CONFIG.cloudinarySecret
    })
    res.render('space/cloudinary.jade', {cloudinary:cloudinary, cloud: CONFIG.cloudinaryCloud, key: CONFIG.cloudinaryKey});
  })

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
    } else {
      req.session.followup = '/space/create';
      res.redirect('/signup');
    }
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
    if (!data.terms || !data.address || !data.zip)
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
      cloudinary.config({
        cloud_name: CONFIG.cloudinaryCloud,
        api_key: CONFIG.cloudinaryKey,
        api_secret: CONFIG.cloudinarySecret
      });
      res.render('space/edit.jade', { space: space, cloudinary:cloudinary, cloud: CONFIG.cloudinaryCloud, key: CONFIG.cloudinaryKey });
    })
  })

  app.post('/space/edit/:id', loggedIn, function(req, res) {
    var address = req.param('address');
    var zip = req.param('zip');
    if(address === '' || zip === '') {
      Space.findById(req.param('id'), function(err, space) {
        if (err) return next(err); //@TODO next() is undefined, fix this error.
        if (!space) return next();
        return res.render('space/edit.jade', {noAddressZip:true, space:space})
      })
    } else {
      Space.edit(req, function(err) {
        //if (err) return next(err); //@TODO next() is undefined, fix this error.
        if (err) console.log(err);
        res.redirect('/space/edit/' + req.param('id'));
      })
    }
  })

  app.get('/space/remove/:id', loggedIn, function(req, res) {
    // @TODO this needs to search by id AND contact to ensure the logged in user is the space owner
    Space.findById(req.param('id'), function(err, space) {
      if (err) return next(err);
      if (!space) return next();
      return res.render('space/delete.jade', {space:space})
    })
  })

  app.post('/space/remove/:id', loggedIn, function(req, res) {
    Space.findOneAndRemove({_id: req.param('id'), contact: req.session.user}, null, function(err, space) {
      if (err) return next(err);
      if (!space) res.render('space/deleted.jade', {spaceNotFound: true});
      else res.render('space/deleted.jade', {spaceDeleted: true, space: space});
    })
  })

  app.get('/space/list', function(req, res) {
    Space.find({}, null, { limit: 25 }, function (err, spaces) {
      if (err) return next(err);
      if (!spaces) return next();
      return res.render('space/list.jade', {spaces: spaces});
    });
  })

  app.get('/space/map', function(req, res) {
    return res.render('space/map.jade', {cloud: CONFIG.cloudinaryCloud, key: CONFIG.cloudinaryKey});
  })
}