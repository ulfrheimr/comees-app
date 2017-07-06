var Sale = require('../models/sale');
var Presentation = require('../models/presentation');
var StockController = require('./stock');

var createSale = (usr) => {
  return new Promise((resolve, reject) => {
    var s = new Sale();
    s.timestamp = new Date();
    s.usr = usr;

    s.save((err, sale) => {
      if (err) reject(err)

      resolve(sale);
    });
  });
}

var addDrug = (product, id) => {
  return new Promise((resolve, reject) => {
    StockController.removeFromStock(product.drug, product.qty)
      .then(s => {
        console.log("then");
        var d = {
          qty: product.qty,
          drug: s.drug,
          sale_price: product.price,
          price_with_discount: product.price_discount,
          type_discount: product.type_discount,
          discount: product.discount
        }

        console.log(d);

        Sale.update({
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

            return resolve(res.ok);
          });
      })
      .catch(err => {
        console.log("reject");
        reject("Stock isn't find for drug")
      });

  });
}

var findSales = (query) => {
  return new Promise((resolve, reject) => {
    Presentation.find({})
      .exec((err, press) => {
        var presses = {}
        press.map(p => presses[p._id] = p["presentation"])

        Sale.find(query)
          .populate('drugs.drug')
          .exec((err, sales) => {

            console.log(sales);

            sales = sales.map(s => {
                return {
                  timestamp: s.timestamp,
                  usr: s.usr,
                  drugs: s.drugs.map(d => {
                    var temp = JSON.parse(JSON.stringify(d));
                    temp.drug.presentation = presses[temp.drug.presentation]

                    return temp;
                  })
                };
              }


            );

            if (err) reject(err);

            resolve(sales);
          });
      });

  });


}

Promise.all([createSale]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var s = {
  putSale: (req, res) => {
    var usr = req.body.usr;

    createSale(usr)
      .then((sale) => {
        res.json({
          ok: 1,
          data: sale
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },
  addDrugs: (req, res) => {
    addDrug({
        qty: req.body.qty,
        drug: req.body.drug,
        price: req.body.sale_price,
        price_discount: req.body.price_discount,
        type_discount: req.body.type_discount,
        discount: req.body.discount
      }, req.body.id_sale)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });

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
      .catch((err) => {
        res.status(500).send(err);
      });
  },
  getSale: (req, res) => {
    var id = req.params.id;

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
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}

module.exports = s;
