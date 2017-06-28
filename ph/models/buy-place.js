var mongoose = require('mongoose');

var BuyPlaceSchema = mongoose.Schema({
  place: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  mail: {
    type: String,
  },
  contact: {
    type: String
  }
});

module.exports = mongoose.model('BuyPlace', BuyPlaceSchema);
