var Sale = require('../models/sale');

var createSale = () => {
  return new Promise((resolve, reject) => {
    var s = new Sale();

    s.timestamp = new Date();

    s.save((err, sale) => {
      if (err) reject(err)

      resolve(sale);
    });
  });
}

var addMi = (product, id) => {
  return new Promise((resolve, reject) => {
    var m = {
      qty: product.qty,
      mi: product.mi,
      sale_price: product.price,
      price_with_discount: product.price_discount,
      type_discount: product.type,
      discount: product.discount
    }

    console.log(m);
    console.log(id);

    Sale.findOne({
      _id: id
    }, function(err, stuff) {
      console.log(err);
      console.log(stuff);
    })


    Sale.update({
        _id: id
      }, {
        $push: {
          mis: m
        }
      }, {
        upsert: true
      },
      (err, res) => {
        if (err) reject(err);

        if (res.ok != 1) reject("Internal error");

        return resolve(res.ok);
      });
  });
}

var findSales = (query) => {
  return new Promise((resolve, reject) => {
    Sale.find(query)
      .populate('mis.mi')
      .exec((err, sales) => {
        if (err) reject(err);

        resolve(sales);
      });
  });
}

Promise.all([createSale]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var s = {
  putSale: (req, res) => {
    createSale()
      .then((sale) => {
        res.json({
          ok: 1,
          data: sale
        });
      })
      .catch((err) => res.status(500).send(err));
  },
  addMis: (req, res) => {
    addMi({
        qty: req.body.qty,
        mi: req.body.mi,
        price: req.body.sale_price,
        price_discount: req.body.price_discount,
        type: req.body.type_discount,
        discount: req.body.discount
      }, req.body.id_sale)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      })
      .catch((err) => res.status(500).send(err));

  },
  getSales: (req, res) => {
    var init = req.query.init;
    var end = req.query.end;
    var query = {
      $and: [{
          timestamp: {
            // min sec millis
            $gte: init
          }
        },
        {
          timestamp: {
            $lte: end
          }
        }
      ]
    }

    findSales(query)
      .then((sales) => {
        res.json({
          ok: 1,
          data: sales
        })
      })
      .catch((err) => res.status(500).send(err));
  },
  getSale: (req, res) => {
    var id = req.params.id;

    console.log(id);

    findSales({
        _id: id
      })
      .then((sales) => {
        if (sales.length == 0) throw "No found sales";
        res.json({
          ok: 1,
          data: sales[0]
        })
      })
      .catch((err) => res.status(500).send(err));
  }
}

module.exports = s;
