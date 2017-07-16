var Cat = require('../models/cat');

var saveCat = (cat) => {
  return new Promise((resolve, reject) => {
    var mic = new Cat();
    mic.name = cat.name;

    mic.save((err, cat) => {
      if (err) reject(err);

      resolve(cat);
    });
  });
}

var findCats = (query) => {
  return new Promise((resolve, reject) => {
    Cat.find(query)
      .exec((err, cats) => {
        if (err) reject(err);

        resolve(cats);
      });
  });
}

Promise.all([saveCat]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var s = {
  putCat: (req, res) => {
    saveCat({
        name: req.body.name
      })
      .then((r) => {
        res.json({
          ok: 1,
          message: "Category added",
          data: r
        });
      }).catch((err) => res.status(500).send(err));
  },
  getCats: (req, res) => {
    findCats({})
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      })
      .catch((err) => res.status(500).send(err));

  }

}

module.exports = s;
