var BuyPlace = require('../models/buy-place');

var saveBuyPlace = (buy_place) => {
  return new Promise((resolve, reject) => {
    var bp = new BuyPlace();

    bp.place = buy_place.place;
    bp.phone = buy_place.phone;
    bp.mail = buy_place.mail;
    bp.contact = buy_place.contact;

    bp.save((err, bps) => {
      if (err) reject(err);

      resolve(bps);
    });
  });
}

var findBuyPlace = (query) => {
  return new Promise((resolve, reject) => {
    BuyPlace.find(query)
      .exec((err, cs) => {
        if (err) reject(err);

        resolve(cs);
      });
  });
}

Promise.all([saveBuyPlace, findBuyPlace]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var p = {
  putBuyPlace: (req, res) => {
    saveBuyPlace({
        place: req.body.place,
        phone: req.body.phone,
        mail: req.body.mail,
        contact: req.body.contact
      })
      .then((r) => {
        res.json({
          ok: 1,
          message: "Buy place added",
          data: r
        });
      }).catch((err) => res.status(500).send(err));
  },
  getBuyPlaces: (req, res) => {
    findBuyPlace({})
      .then(bps => {
        res.json({
          ok: 1,
          data: bps
        })
      })
      .catch((err) => res.status(500).send(err));
  }
}


module.exports = p;
