var mongoose = require('mongoose');

var ClientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rfc: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  mail: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Client', ClientSchema);
