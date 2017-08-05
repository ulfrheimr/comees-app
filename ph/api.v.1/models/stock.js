var mongoose = require('mongoose');

var StockSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  drug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drug',
    required: true
  }
});

module.exports = mongoose.model('Stock', StockSchema);
