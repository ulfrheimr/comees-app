var mongoose = require('mongoose');

var SaleSchema = mongoose.Schema({
  timestamp: {
    type: Date,
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
    sale_price: {
      type: Number,
      required: true
    },
    price_with_discount: {
      type: Number,
      required: true
    },
    discount: {
      type: String
    },
    type_discount: {
      type: Number
    }
  }]
});

module.exports = mongoose.model('Sale', SaleSchema);
