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
    var lat = req.param('lat');
    var lng = req.param('lng');

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

  app.post('/api/update-geo-address', function(req, res) {
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
};

// 5346d23473d314107e16447e
// curl --data "id=5346d23473d314107e16447e&lat=-84.38362970000003&lng=33.7811643" http://localhost:3000/api/add-geo