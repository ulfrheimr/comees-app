var mongoose = require('mongoose');

var MISchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: {
    type: String
  }

});

module.exports = mongoose.model('MI', MISchema);
