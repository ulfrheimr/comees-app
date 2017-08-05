var Laboratory = require('../models/lab');

var saveLab = (laboratory) => {
  return new Promise((resolve, reject) => {
    var l = new Laboratory();
    l.lab = laboratory.lab;

    l.save((err, lab) => {
      if (err) reject(err);

      resolve(lab);
    });
  });
}

var findLabs = (query) => {
  return new Promise((resolve, reject) => {
    Laboratory.find(query)
      .exec((err, lab) => {
        if (err) reject(err);

        resolve(lab);
      });
  });
}

Promise.all([findLabs, saveLab]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var p = {
  putLab: (req, res) => {
    console.log("adsad");
    saveLab({
        lab: req.body.lab
      })
      .then((r) => {
        res.json({
          ok: 1,
          message: "Laboratory added",
          data: r
        });
      }).catch((err) => res.status(500).send(err));
  },
  getLabs: (req, res) => {
    findLabs({})
      .then(labs => {
        res.json({
          ok: 1,
          data: labs
        })
      })
      .catch((err) => res.status(500).send(err));
  }
}


module.exports = p;
