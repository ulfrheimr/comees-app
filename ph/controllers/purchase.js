var Purchase = require('../models/purchase');
var StockController = require('./stock');

var createPurchase = (buy_place) => {
  return new Promise((resolve, reject) => {
    var p = new Purchase();

    p.timestamp = new Date();
    p.place = buy_place;

    p.save((err, purchase) => {
      if (err) reject(err)

      resolve(purchase);
    });
  });
}

var addDrug = (product, id) => {
  return new Promise((resolve, reject) => {

    StockController.addToStock(product.drug, product.qty)
      .then(s => {
        var id_drug = s.drug;
        
        var d = {
          qty: product.qty,
          drug: id_drug,
          price: product.price,
        }

        Purchase.update({
            _id: id
          }, {
            $push: {
              drugs: d
            }
          }, {
            upsert: true
          },
          (err, res) => {
            if (err) reject(err);

            if (res.ok != 1) reject("Internal error");

            resolve(res.ok);
          });
      })
      .catch(err => {
        reject("Stock isn't find for drug")
      });
  });
}

var findPurchases = (query) => {
  return new Promise((resolve, reject) => {
    Purchase.find({})
      .populate('drugs.drug')
      .populate('place')
      .exec((err, purchases) => {
        if (err) reject(err);

        resolve(purchases);
      });
  });
}

Promise.all([createPurchase]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var s = {
  putPurchase: (req, res) => {
    var buy_place = req.body.buy_place;

    createPurchase(buy_place)
      .then((purchase) => {
        res.json({
          ok: 1,
          data: purchase
        });
      })
      .catch((err) => res.status(500).send(err));
  },
  addDrug: (req, res) => {
    addDrug({
        qty: req.body.qty,
        drug: req.body.id_drug,
        price: req.body.price
      }, req.body.id_purchase)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      })
      .catch((err) => res.status(500).send(err));

  },
  getPurchases: (req, res) => {
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

    findPurchases(query)
      .then((purchases) => {
        res.json({
          ok: 1,
          data: purchases
        })
      })
      .catch((err) => res.status(500).send(err));
  },
  getSale: (req, res) => {
    // var id = req.params.id;
    //
    // findSales({
    //     _id: id
    //   })
    //   .then((sales) => {
    //     if (sales.length == 0) throw "No found sales";
    //     res.json({
    //       ok: 1,
    //       data: sales[0]
    //     })
    //   })
    //   .catch((err) => res.status(500).send(err));
  }
}

module.exports = s;
