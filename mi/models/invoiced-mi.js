var mongoose = require('mongoose');

var InvoicedMISchema = mongoose.Schema({
  mi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MISchema'
  },
  facturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facturer'
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('InvoicedMI', InvoicedMISchema);
