var UsedCoupon = require('../models/used-coupon');

var saveCoupon = (uc) => {
  return new Promise((reject, resolve) => {
    var c = new UsedCoupon();

    c.coupon = uc.coupon;
    c.sale = uc.sale;
    c.type = uc.type;
    c.timestamp = new Date();

    c.save((err, usedcoupon) => {
      console.log(err);
      if (err) reject(err)

      resolve(usedcoupon);
    });
  });
}

var findCoupon = (query) => {
  return new Promise((resolve, reject) => {
    UsedCoupon.find(query)
      .populate('coupon')
      .exec((err, cs) => {
        if (err) reject(err);

        resolve(cs);
      });
  });
}


Promise.all([saveCoupon, findCoupon]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var uc = {
  putCoupon: (req, res) => {
    saveCoupon({
        coupon: req.body.coupon,
        sale: req.body.sale,
        type: req.body.type
      })
      .then((id) => {
        res.json({
          ok: 1,
          data: id
        });
      })
      .catch((err) => res.status(500).send(err));
  },
  getCouponByDate: (req, res) => {
    var initDate = req.query.init;
    var endDate = req.query.end;

    var query = {
      $and: [{
          timestamp: {
            // min sec millis
            $gte: initDate
          }
        },
        {
          timestamp: {
            $lte: endDate
          }
        }
      ]
    }

    console.log(query);

    findCoupon(query)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        })
      })
      .catch((err) => res.status(500).send(err));
  }
}

module.exports = uc;
