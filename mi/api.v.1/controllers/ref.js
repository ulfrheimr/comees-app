var Ref = require('../models/ref');
var PhysController = require('../controllers/phys');
var PhysComissionController = require('./comm')

var queryPhys = (query) => {
  return PhysController.queryPhys(query)
    .then((p) => {
      if (p.length == 0) throw "No found Phys";
      id = p[0]._id;

      return id;
    })
    .catch((err) => res.status(500).send(err));
}

var savePhysMI = (s) => {
  return new Promise((resolve, reject) => {
    var ref = new Ref();

    ref.phys = s.phys;
    ref.mi = s.mi;
    ref.sale_price = s.price;
    ref.timestamp = new Date();
    ref.commission = s.commission;

    ref.save((err, r) => {
      if (err) reject(err);

      resolve(r);
    });
  });
}

var findPhysMi = (query) => {
  return new Promise((resolve, reject) => {
    Ref.find(query)
      .populate('mi')
      .exec((err, pmis) => {
        console.log("RESPONSE PMIS");
        console.log(pmis);
        if (err) reject(err);

        resolve(pmis);
      });
  });
}

var findPhysMIbyDate = (sender) => {
  var query = {
    $and: [{
        timestamp: {
          // min sec millis
          $gte: sender.initDate
        }
      },
      {
        timestamp: {
          $lte: sender.endDate
        }
      },
      {
        phys: sender.id
      }
    ]
  }

  console.log("FIND PHYS MI");
  console.log(query);
  return findPhysMi(query);
}


var getDiscountbyDate = (id, init, end) => {

  return new Promise((resolve, reject) => {
    findPhysMIbyDate({
        id: id,
        initDate: init,
        endDate: end
      })
      .then((r) => {
        var count_mis = r.length;

        console.log("COUNT MIS: " + count_mis)
        console.log(id);

        PhysComissionController.queryPhysComission({
            $and: [{
              bottom: {
                $lte: count_mis
              }
            }, {
              phys: id
            }]
          })
          .then((pc) => {
            if (pc.length == 0) reject("No comissions found");

            resolve(pc[0].percentage);
          });
      })
      .catch((err) => reject(err));
  });

}



Promise.all([savePhysMI]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var c = {
  sendPhysMi: (idPhys, idMi, price) => {
    var today = new Date();
    var firstOfMonth = new Date(today.getUTCFullYear(), today.getUTCMonth(), 1);

    getDiscountbyDate(idPhys, firstOfMonth, today)
      .then((discount => {

        savePhysMI({
            phys: idPhys,
            mi: idMi,
            price: price,
            commission: discount
          })
          .then((r) => {
            console.log(r);
            // res.json({
            //   ok: 1,
            //   message: "Phys MI added"
            // });
          })
          .catch((err) => console.log(err));
      }))
      .catch((err) => console.log(err));
  },
  putPhysMI: (req, res) => {
    var id = req.body.id_phys;
    var today = new Date();
    var firstOfMonth = new Date(today.getUTCFullYear(), today.getUTCMonth(), 1);

    getDiscountbyDate(id, firstOfMonth, today)
      .then((discount => {

        savePhysMI({
            phys: req.body.id_phys,
            mi: req.body.id_mi,
            price: req.body.price,
            commission: discount
          })
          .then((r) => {
            console.log(r);
            res.json({
              ok: 1,
              message: "Phys MI added"
            });
          })
          .catch((err) => res.status(500).send(err));
      }))
      .catch((err) => res.status(500).send(err));


  },
  getPhysMI: (req, res) => {
    console.log("asdasd");
    var seachField = req.query.by || "id";
    var phys_id = req.params.phys_id;
    var initDate = req.query.init;
    var endDate = req.query.end;

    var query = {
      id: phys_id,
      by: seachField
    }

    PhysController.getPhys(query)
      .then((r) => {
        if (r.status == 200 && r.data.data.length > 0) {
          var id = r.data.data[0]._id;
          findPhysMIbyDate({
              id: id,
              initDate: initDate,
              endDate: endDate
            })
            .then((r) => {
              res.json({
                ok: 1,
                data: r
              })
            })
            .catch((err) => res.status(500).send(err));

        } else throw "No found endpoint";
      })
      .catch((err) => res.status(500).send(err));
  },
  getPhysDiscount: (req, res) => {
    var seachField = req.query.by || "id";
    var id = req.params.phys_id;
    var query = {
      _id: id
    }

    switch (seachField) {
      case "code":
        query = {
          code: id
        }
        break;
      case "mail":
        query = {
          mail: id
        }
        break;
    }

    PhysController.getPhys({
        id: id,
        by: seachField
      })
      .then((r) => {
        console.log(r);

        if (r.data.data.length == 0) {
          res.json({
            ok: 1,
            data: 0
          });
        }

        var physsID = r.data.data[0]["_id"];


        var today = new Date();
        var firstOfMonth = new Date(today.getUTCFullYear(), today.getUTCMonth(), 1);

        console.log("PHYSS ID");
        console.log(physsID);

        getDiscountbyDate(physsID, firstOfMonth, today)
          .then((discount => {
            console.log("asdasd");
            console.log(discount);


            res.json({
              ok: 1,
              data: discount
            });
          }))
          .catch((err) => res.status(500).send(err));

      })
      .catch((err) => {
        if (err.split(":")[0] == "01") {
          res.json({
            ok: 0,
            data: 0
          });
        }

        res.status(500).send(err)
      });
  },
  queryPhysMI: (query) => {
    return findPhysMi(query);
  }
};


module.exports = c;
