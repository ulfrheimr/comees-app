var mongoose = require('mongoose');

var InvoiceSchema = mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
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
  type:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
