var mongoose = require('mongoose');

var PresentationSchema = mongoose.Schema({
  presentation: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Presentation', PresentationSchema);
