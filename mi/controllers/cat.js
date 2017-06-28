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
        console.log(r);
        res.json({
          ok: 1,
          message: "Category added"
        });
      }).catch((err) => res.status(500).send(err));
  }
}

// 59496ebf3e4a803c832b69cf

module.exports = s;
