var mongoose = require('mongoose');

var PhysSchema = mongoose.Schema({
  mail: {
    type: String,
    unique: true,
    sparse: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true
  },
  external: {
    type: Boolean,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  first: {
    type: String,
    required: true
  },
  last: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  rfc: {
    type: String
  },
  bank_account: {
    type: String
  }
});

module.exports = mongoose.model('Physician', PhysSchema);
