var mongoose = require('mongoose');

var InvoiceSchema = mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  is_invoiced: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    required: true
  },
  paymentAccount: {
    type: String
  }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
