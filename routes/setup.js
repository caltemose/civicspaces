var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Space = mongoose.model('Space');

module.exports = function (app) {
  app.get('/setup/spaces/remove', function(req, res) {
    res.send('@TODO implement /setup/spaces/remove')
  })

  app.get('/setup/spaces/', function(req, res) {
    var spaces = [
      {
        address: '999 Peachtree Street',
        city: 'Atlanta',
        zip: '30309',
        contact: 'chad@chadzilla.com',
        geo: {
          lat: 33.7811643,
          lng: -84.38362970000003
        }
      },
      {
        address: '1099 Euclid Ave NE',
        city: 'Atlanta',
        zip: '30307',
        contact: 'chad@chadzilla.com',
        geo: {
          lat: 33.763518,
          lng: -84.35093599999999
        }
      },
      {
        address: '3652 Roswell Road NE',
        city: 'Atlanta',
        zip: '30305',
        contact: 'chad@chadzilla.com',
        geo: {
          lat: 33.85416860000001,
          lng: -84.38304210000001
        }
      }
    ];
    Space.create(spaces, function(err, space1, space2, space3) {
      if (err) res.send('error setting up default spaces');
      var msg = '<ul>';
      if (space1) msg += '<li>' + space1.address + '</li>';
      if (space2) msg += '<li>' + space2.address + '</li>';
      if (space3) msg += '<li>' + space3.address + '</li>';
      msg += '</ul>';
      res.send(msg);
    })
  })

}

