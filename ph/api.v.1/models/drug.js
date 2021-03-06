var mongoose = require('mongoose');

var DrugSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  substance: {
    type: String,
    required: true
  },
  presentation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presentation',
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  qty: {
    type: Number
  },
  lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratory',
    required: true
  },
  sale_price: {
    type: Number,
    required: true
  },
  max_price: {
    type: Number,
    required: true
  },
  ssa: {
    type: String
  },
  desc: {
    type: String
  },
  to_follow: {
    type: Boolean,
    required: true
  },
  cat: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Drug', DrugSchema);
