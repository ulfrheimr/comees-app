var Usr = require('../models/usr');

var l = {
  login: (req, res) => {
    var query = {
      $and: [{
          usr: req.body.usr
        },
        {
          pass: req.body.pass
        }
      ]
    }

    Usr.findOne(query)
      .exec((err, usr) => {
        if (err) res.status(500).send(err);

        res.json({
          ok: usr != null,
          data: usr != null
        });
      });
  }
}

module.exports = l;
