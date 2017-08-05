var Stock = require('../models/stock');
var DrugController = require('./drug');

var changeStock = (qty, drug) => {
  return new Promise((resolve, reject) => {
    getStock(drug)
      .then(d => {
        console.log("Stock");
        console.log(d.stock == undefined);

        if (d.stock == undefined || d.stock.length == 0) {

          var s = new Stock();

          s.qty = qty;
          s.timestamp = new Date();
          s.drug = d.drug._id;

          s.save((err, s) => {
            if (err) reject(err);

            resolve(s);
          });
        } else {
          var total = parseInt(d.stock.qty) + parseInt(qty);
          if (total < 0)
          {
            console.log("Error");
            reject("Operation not permitted: Stock insufficient");
            return;
          }

          console.log("Stil working");
          Stock.findOneAndUpdate({
            _id: d.stock._id
          }, {
            qty: total,
            timestamp: new Date(),
            drug: d.drug._id
          }, {
            upsert: true
          }, function(err, s) {
            if (err) reject(err);
            resolve(s);
          });
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })

  });
}

var getStock = (drug) => {
  return new Promise((resolve, reject) => {
    DrugController.getDrugByCode(drug)
      .then(d => {
        Stock.find({
            drug: d._id
          })
          .exec((err, s) => {
            if (err) reject(err);

            resolve({
              drug: d,
              stock: s[0]
            });
          });
      })
      .catch(err => reject(err));
  });
}

Promise.all([getStock]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var s = {
  getStock: (req, res) => {
    var id = req.params.id;

    getStock(id)
      .then(s => {
        res.json({
          ok: 1,
          data: s
        })
      })
      .catch((err) => {
        res.status(500).send(err);
      });

  },
  addToStock: (drug, qty) => {
    return new Promise((resolve, reject) => {
      changeStock(qty, drug)
        .then(ds => resolve(ds))
        .catch(err => reject(err))
    });

  },
  removeFromStock: (drug, qty) => {
    return new Promise((resolve, reject) => {
      changeStock(-1 * qty, drug)
        .then(s => resolve(s))
        .catch(err =>{ console.log(err); reject(err)});
    });
  }
};

module.exports = s;
