var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Space = mongoose.model('Space');

module.exports = function (app) {

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
      return res.json({success:true});
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
    var email = req.param('email');
    var name = req.param('name');
    var phone = req.param('phone');

    if (!email || (!name && !phone))
      return res.json({err:"You must supply valid parameters for: email and (name or phone)"});
    
    User.findByIdAndUpdate(email, {name:name, phone:phone}, null, function(err, user) {
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
};
