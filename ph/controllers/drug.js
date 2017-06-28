var Drug = require('../models/drug');

var saveDrug = (drug) => {
  return new Promise((resolve, reject) => {
    var d = new Drug();

    d.code = drug.code;
    d.name = drug.name;
    d.substance = drug.substance;
    d.presentation = drug.presentation;
    d.dosage = drug.dosage;
    d.lab = drug.lab;
    d.qty = drug.qty;
    d.desc = drug.desc;
    d.sale_price = drug.sale_price;
    d.max_price = drug.max_price;
    d.ssa = drug.ssa;

    d.save((err, ds) => {
      if (err) reject(err);

      resolve(ds);
    });
  });
}

var findDrugs = (query) => {
  return new Promise((resolve, reject) => {
    Drug.find(query)
      .populate('presentation')
      .populate('lab')
      .exec((err, ds) => {
        if (err) reject(err);

        resolve(ds);
      });
  });
}

var getDrugByCode = (code) => {
  var query = {
    code: code
  };
  return new Promise((resolve, reject) => {
    findDrugs(query)
      .then(ds => {

        if (ds.length != 1)
          reject("Drug not found");

        resolve(ds[0])
      })
      .catch((err) => {
        console.log(err);
        reject(err)
      });
  });
}

Promise.all([saveDrug, findDrugs]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var p = {
  putDrug: (req, res) => {
    var d = {
      code: req.body.code,
      name: req.body.name,
      substance: req.body.substance,
      presentation: req.body.id_presentation,
      dosage: req.body.dosage,
      qty: req.body.qty,
      lab: req.body.id_lab,
      sale_price: req.body.sale_price,
      max_price: req.body.max_price,
      ssa: req.body.ssa,
      desc: req.body.desc
    };

    saveDrug(d)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      }).catch((err) => res.status(500).send(err));
  },
  getDrugs: (req, res) => {
    var searchField = req.query.by || "substance";
    var search = req.query.search;

    if (searchField != "substance" && searchField != "name" && searchField != "ssa")
      throw "Unssuported category";

    var query = {
      [searchField]: {
        $regex: ".*" + search + ".*",
        $options: 'i'
      }
    }

    if (search == "*")
      query = {}

    findDrugs(query)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        })
      })
      .catch((err) => res.status(500).send(err));
  },
  getDrug: (req, res) => {
    var id = req.params.id;

    return getDrugByCode(id)
      .then(ds => {
        res.json({
          ok: 1,
          data: ds
        })
      })
      .catch((err) => res.status(500).send(err));
  },
  getDrugByCode: (code) => {
    return getDrugByCode(code);
  }
};

module.exports = p;
