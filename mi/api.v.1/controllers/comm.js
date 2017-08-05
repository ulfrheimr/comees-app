var Commission = require('../models/comm');

var saveComission = (com) => {
  return new Promise((resolve, reject) => {
    var pc = new Commission();

    pc.phys = com.physId;
    pc.bottom = com.bottom;
    pc.percentage = com.perc;

    pc.save((err, r) => {
      if (err) reject(err);

      resolve(r);
    });
  });
}

var findComission = (query) => {
  return new Promise((resolve, reject) => {
    Commission.find(query)
      .sort({
        bottom: -1
      })
      .exec((err, coms) => {
        if (err) reject(err);
        resolve(coms);
      });
  });
}


Promise.all([saveComission, findComission]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var c = {
  putPhysComission: (req, res) => {
    saveComission({
        physId: req.body.physId,
        bottom: req.body.bottom,
        perc: req.body.perc
      })
      .then(
        (r) => {
          res.json({
            ok: 1,
            data: r,
            message: "Comision added"
          })
        }
      )
      .catch((err) => res.status(500).send(err));
  },
  getPhysCommission: (req, res) => {
    findComission({
        phys: req.params.id
      })
      .then((c) => {
        res.json({
          ok: 1,
          data: c
        })
      })
      .catch((err) => res.status(500).send(err));
  },
  queryPhysComission: (query) => {
    return findComission(query);
  }
};

module.exports = c;
