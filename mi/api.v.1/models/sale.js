var mongoose = require('mongoose');

var SaleSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  usr: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  mis: [{
    qty: {
      type: Number
    },
    mi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MI',
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
      type: String
    }
  }]
});

module.exports = mongoose.model('Sale', SaleSchema);
