var mongoose = require('mongoose');

var UsrSchema = mongoose.Schema({
  usr: {
    type: String,
    required: true,
    unique: true
  },
  pass: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UsrSchema);
