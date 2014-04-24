
var mongoose = require('mongoose');
var createdDate = require('../plugins/createdDate');
var validEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
    _id: { type: String, lowercase: true, trim: true, validate: validEmail }
  , name: { type: String, required: true }
  , phone: { type: String, required: true }
  , salt: { type: String, required: true }
  , hash: { type: String, required: true }
  , resetSent: { type: Date }
});

// add created date property
schema.plugin(createdDate);

// properties that do not get saved to the db
// schema.virtual('fullname').get(function () {
//   return this.name.first + ' ' + this.name.last;
// })

module.exports = mongoose.model('User', schema);
