var Usr = require('../models/usr');

var createUsr = (u) => {
  return new Promise((resolve, reject) => {
    var usr = new Usr();

    usr.usr = u.usr;
    usr.pass = u.pass;
    usr.name = u.name;
    usr.role = u.role;

    usr.save((err, user) => {
      if (err) reject(err);

      resolve(user);
    });
  });
}

var findUsr = (query) => {
  return new Promise((resolve, reject) => {
    Usr.find(query)
      .exec((err, r) => {
        if (err) reject(err);

        resolve(r);
      });
  });
}

var transformUsr = (usr) => {
  return {
    name: usr.name,
    role: usr.role,
    usr: usr.usr
  };
}

Promise.all([createUsr, findUsr]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var u = {
  putUsr: (req, res) => {
    var u = {
      name: req.body.name,
      usr: req.body.usr,
      pass: req.body.pass,
      role: req.body.role
    };

    createUsr(u)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      }).catch((err) => res.status(500).send(err));


  },
  getUsr: (req, res) => {
    var id = req.params.id;

    findUsr({
        usr: id
      })
      .then((r) => {
        if (r.length != 1) throw "There is an error finding a usr";

        r = r.map((x) => {
          return {
            name: x.name,
            role: x.role,
            usr: x.usr
          }
        });

        res.json({
          ok: 1,
          data: r
        })
      })
      .catch((err) => res.status(500).send(err));
  }
};

module.exports = u;
