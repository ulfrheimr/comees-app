var Facturer = require('../models/facturer');

var saveFacturer = (facturer) => {
  return new Promise((resolve, reject) => {
    var f = new Facturer();

    f.name = facturer.name;

    f.save((err, fs) => {
      if (err) reject(err);

      resolve(fs);
    });
  });
}

var findFacturer = (query) => {
  return new Promise((resolve, reject) => {
    Facturer.find(query)
      .exec((err, fs) => {
        if (err) reject(err);

        resolve(fs);
      });
  });
}

Promise.all([saveFacturer, findFacturer]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var f = {
  putFacturer: (req, res) => {
    saveFacturer({
        name: req.body.name
      })
      .then((r) => {
        console.log(r);
        res.json({
          ok: 1,
          message: "Facturer added",
          data: r
        });
      })
      .catch((err) => res.status(500).send(err));
  },
  getFacturers: (req, res) => {
    findFacturer({})
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      })
      .catch((err) => res.status(500).send(err));
  }
}

module.exports = f;
