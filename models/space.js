var mongoose = require('mongoose');
var createdDate = require('../plugins/createdDate');
var cleanString = require('../helpers/cleanString');
var validEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
  //primary required properties
  address: { type: String, required: true, trim: true },
  city: { type: String, trim: true },
  zip: { type: String, required: true, trim: true },
  contact: { type: String, lowercase: true, required: true, trim: true },
  //secondary properties
  type: { type: String, enum: ['Storefront', 'Office Only', 'Loft/Mixed Use', 'Land/Property']},
  leaseLength: { type: String, enum: ['Single-day Use', 'Multi-day Use', 'Multi-week Use', 'Long-term Use']},
  area: {type:String},
  maxOccupants: {type:Number},
  allowed: {
    foodBev: {type:Boolean},
    alcohol: {type:Boolean},
    music: {type:Boolean},
    modifications: {type:String, enum: ['None', 'Non-intrusive', 'Intrusive']}
  },
  amenities: {
    wifi: {type:Boolean},
    parkingOnSite: {type:Boolean},
    handicap: {type:Boolean},
    furnished: {type:Boolean},
    bathroom: {type:String, enum: ['None', 'Single', 'Multiple']},
    kitchen: {type:String, enum: ['None', 'Partial', 'Full']}
  },
  description: {type:String}
})

schema.statics.edit = function(req, callback) {
  var id = req.param('id');
  var author = req.session.user;
  var query = { _id: id, contact: author };
  var update = {};
  //req'd
  update.address = cleanString(req.param('address'));
  update.city = cleanString(req.param('city'));
  update.zip = cleanString(req.param('zip'));
  //optional
  if (req.param('type').length > 0) update.type = req.param('type');
  if (req.param('leaseLength').length > 0) update.leaseLength = req.param('leaseLength');
  if (req.param('area').length > 0) update.area = req.param('area');
  if (req.param('maxOccupants').length > 0) update.maxOccupants = req.param('maxOccupants');
  //update the model
  this.update(query, update, function(err, affected) {
    if (err) return callback(err);
    if (0 === affected) return callback(new Error('No Space to modify.'));
    callback();
  })
}


schema.plugin(createdDate);

module.exports = mongoose.model('Space', schema);
