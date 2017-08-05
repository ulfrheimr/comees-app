var mongoose = require('mongoose');

var UsedCouponSchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  sale: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('UsedCoupon', UsedCouponSchema);
