var Coupon = require('../models/coupon');
var CouponCats = require('../models/coupon-cats');

var saveCoupon = (c) => {
  return new Promise((resolve, reject) => {
    var coupon = new Coupon();
    coupon.code = c.code;
    coupon.categories = c.cats;
    coupon.init_date = c.init_date;
    coupon.end_date = c.end_date;
    coupon.discount = c.discount;
    coupon.description = c.description;

    coupon.save((err, r) => {
      if (err) reject(err);

      resolve(r);
    });
  });
}

var findCoupon = (query) => {
  return new Promise((resolve, reject) => {
    Coupon.find(query)
      .populate('category')
      .exec((err, cs) => {
        if (err) reject(err);

        resolve(cs);
      });
  });
}


Promise.all([saveCoupon]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var s = {
  putCoupon: (req, res) => {
    
    var a = {
      code: req.body.code,
      cats: req.body.cats,
      init_date: req.body.init_date,
      end_date: req.body.end_date,
      discount: req.body.discount,
      description: req.body.description,
    }

    a.cats.map((x) => {
      console.log(x);
      if (CouponCats.cats[x] == null)
        throw new Error("Category not allowed");
    });

    saveCoupon({
        code: req.body.code,
        cats: req.body.cats,
        init_date: req.body.init_date,
        end_date: req.body.end_date,
        discount: req.body.discount,
        description: req.body.description,
      })
      .then((r) => {
        res.json({
          ok: 1,
          message: "Coupon added"
        });
      }).catch((err) => res.status(500).send(err));
  },
  getCoupon: (req, res) => {
    var id = req.params.code;

    findCoupon({
        code: id
      })
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        })
      })
      .catch((err) => res.status(500).send(err));
  },
  getCouponByDate: (req, res) => {
    var initDate = req.query.init;
    var endDate = req.query.end;

    var query = {
      $and: [{
          init_date: {
            // min sec millis
            $gte: initDate
          }
        },
        {
          end_date: {
            $lte: endDate
          }
        }
      ]
    }

    findCoupon(query)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        })
      })
      .catch((err) => res.status(500).send(err));
  },
  queryCoupons: (query) => {
    return findCoupon(query);
  }
}

module.exports = s;
