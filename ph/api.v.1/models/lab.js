var mongoose = require('mongoose');

var LabSchema = mongoose.Schema({
  lab: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Laboratory', LabSchema);
