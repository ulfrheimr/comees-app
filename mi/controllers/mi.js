var MI = require('../models/mi');

var saveMI = (mi) => {
  return new Promise((resolve, reject) => {
    var m = new MI();

    m.name = mi.name;
    m.price = mi.price;
    m.description = mi.desc;
    m.category = mi.catId;

    m.save((err, mis) => {
      if (err) reject(err);

      resolve(mis);
    });
  });
}

var findMIs = (query) => {
  return new Promise((resolve, reject) => {
    MI.find(query)
      .populate('category')
      .exec((err, mis) => {
        if (err) reject(err);

        resolve(mis);
      });
  });
}

Promise.all([saveMI]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var s = {
  putMI: (req, res) => {
    saveMI({
        name: req.body.name,
        price: req.body.price,
        catId: req.body.catId,
        desc: req.body.desc
      })
      .then((r) => {
        console.log(r);
        res.json({
          ok: 1,
          message: "MI added"
        });
      })
      .catch((err) => res.status(500).send(err));
  },
  getMIs: (req, res) => {
    var query = {};
    var name = req.query.name;

    if (name != null && name != "")
      query = {
        name: {
          $regex: ".*" + name + ".*",
          $options: 'i'
        }
      }

    findMIs(query)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      })
      .catch((err) => res.status(500).send(err));
  }
};

module.exports = s;
