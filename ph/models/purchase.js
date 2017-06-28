var mongoose = require('mongoose');

var PurchaseSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuyPlace',
    required: true
  },
  drugs: [{
    qty: {
      type: Number
    },
    drug: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drug',
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }]
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
