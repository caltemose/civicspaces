var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Space = mongoose.model('Space');
var cloudinary = require('cloudinary');


module.exports = function (app, CONFIG) {

  app.get('/api/strip-geo/:id', function(req, res) {
    //console.log(req.param('id'));
    Space.findByIdAndUpdate(req.param('id'), {geo:null}, null, function(err, space) {
      if (err) return res.json({err:err});
      if (!space) return res.json({err: "No space found with provided ID"});
      return res.json({success:true, space:space});
    })
  })


  app.post('/api/add-geo', function (req, res) {
    var id = req.param('id');
    var lat = parseFloat(req.param('lat'));
    var lng = parseFloat(req.param('lng'));

    if (!id)
      return res.json({err:"You must provide a valid space id."});
    if (!lng || !lat) 
      return res.json({err:"You must provide lat and lng values."});

    var geo = { lat: lat, lng: lng };
    Space.findByIdAndUpdate(id, {geo: geo}, null, function(err, space) {
      if (err) return res.json({err:err});
      if (!space) return res.json({err:"Could not find a space with the provided id."});
      return res.json({success:true, lat: lat, lng: lng});
    })
  });

  app.post('/api/update/location', function(req, res) {
    var id = req.param('id');
    var lat = req.param('lat');
    var lng = req.param('lng');
    var address = req.param('address');
    var city = req.param('city');
    var zip = req.param('zip');
    if (!id || !lat || !lng || !address || !zip)
      return res.json({err:"You must provide the id, lat, lng, address and zip properties."});
    var geo = { lat: lat, lng: lng };
    Space.findByIdAndUpdate(id, {geo: geo, address: address, zip: zip, city: city}, null, function(err, space) {
      if (err) return res.json({err:err});
      if (!space) return res.json({err:"Could not find a space with the provided ID."});
      return res.json({success:true});
    })
  })

  app.post('/api/user/update', function(req, res) {
    var id = req.param('_id');
    var name = req.param('name');
    var phone = req.param('phone');

    if (!id || (!name && !phone))
      return res.json({err:"You must supply valid parameters for: email and (name or phone)"});
    
    User.findByIdAndUpdate(id, {name:name, phone:phone}, null, function(err, user) {
      if (err) return res.json({err:err});
      if (!user) return res.json({err:"That user does not exist."});
      return res.json({success:true});
    });
  })

  app.get('/api/properties/bounded', function(req, res) {
    var ne_lat = req.param('ne_lat');
    var ne_lng = req.param('ne_lng');
    var sw_lat = req.param('sw_lat');
    var sw_lng = req.param('sw_lng');
    if (!ne_lat || !ne_lng || !sw_lat || !sw_lng)
      return res.jsonp({err: 'missing coordinates'})

    Space.find()
      .where('geo.lat').gt(sw_lat).lt(ne_lat)
      .where('geo.lng').gt(sw_lng).lt(ne_lng)
      .limit(20)
      .select('address city zip contact geo type leaseLength')
      .exec(function(err, spaces) {
        if (err) return res.jsonp({err:err})
        var data = {spaces:[]};
        if (spaces && spaces.length > 0) data = {spaces:spaces};
        return res.jsonp(data);
      })         
  })

  app.post('/api/space/update', loggedIn, function(req, res) {
    Space.updateProperty(req, function(err) {
      if (err) return res.jsonp({err:err});
      res.jsonp({success:true});
    })
  })

  app.post('/api/space/add-image', loggedIn, function(req, res) {
    var cloudinary_id = req.param('cloudinary_id');
    var space_id = req.param('space_id');
    if (!cloudinary_id || !space_id) 
      return res.jsonp({err:'You must provide a cloudinary_id and space_id.'})
    var update = {
      $push: {images: {cloudinary_id: cloudinary_id}}
    }
    Space.findByIdAndUpdate(space_id, update, null, function(err, space) {
      if (err) return res.json({err:err});
      if (!space) return res.json({err:"Could not find a space with the provided ID."});
      return res.jsonp({success:true, cloudinary_id: cloudinary_id, space_id: space_id})
    });
  })

  app.post('/api/space/delete-image', loggedIn, function(req, res) {
    var image_id = req.param('image_id');
    var space_id = req.param('space_id');
    if (!image_id || !space_id) 
      return res.jsonp({err:'You must provide an image_id and space_id.'})
    var update = {
      $pull: { images: { cloudinary_id: image_id }}
    }
    Space.findByIdAndUpdate(space_id, update, null, function(err, space) {
      if (err) return res.jsonp({err:err});
      if (!space) return res.jsonp({err:"No space found with provided id."});
      cloudinary.config({
        cloud_name: CONFIG.cloudinaryCloud,
        api_key: CONFIG.cloudinaryKey,
        api_secret: CONFIG.cloudinarySecret
      })
      cloudinary.uploader.destroy(image_id, function(result) {
        return res.jsonp({success:true, image_id: image_id, result: result});
      }, null);
    })
  })
};
