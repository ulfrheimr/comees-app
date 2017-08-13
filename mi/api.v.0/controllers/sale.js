var Sale = require('../models/sale');
var PhysController = require('../controllers/phys');
var PhysMiController = require('../controllers/phys-mi');

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


    if (m["type_discount"] == "ref_mi") {
      PhysController.getPhys({
          id: m.discount,
          by: "code"
        })
        .then((r) => {
          if (r.data.data.length == 0) {
            console.log("Phys not found");
            return;
          }

          var physsID = r.data.data[0]["_id"];
          console.log(physsID);
          console.log(m.mi);

          PhysMiController.sendPhysMi(physsID, m.mi, m.price_with_discount)

        })
        .catch((err) => {
          console.log(err);
        });
    }

    console.log("MI WRONG");

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
    var usr = req.body.usr;

    createSale(usr)
      .then((sale) => {
        console.log(sale);
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
    var usrId = req.query.usr;

    console.log(usrId);
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

    if (usrId)
      query["usr"] = usrId;


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
