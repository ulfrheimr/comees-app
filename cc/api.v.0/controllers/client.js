var Client = require('../models/client');
var saveClient = (client) => {
  return new Promise((resolve, reject) => {
    var c = new Client();

    c.name = client.name;
    c.rfc = client.rfc;
    c.phone = client.phone;
    c.address = client.address;
    c.mail = client.mail;

    c.save((err, phys) => {
      if (err) reject(err);

      resolve(phys);
    });
  });
}

var findClient = (query) => {
  return new Promise((resolve, reject) => {
    Client.find(query)
      .exec((err, p) => {
        if (err) reject(err);

        resolve(p);
      });
  });
}


Promise.all([saveClient]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var c = {
  putClient: (req, res) => {
    var p = {
      name: req.body.name,
      rfc: req.body.rfc,
      phone: req.body.phone,
      mail: req.body.mail,
      address: req.body.address
    };

    saveClient(p)
      .then((r) => {
        res.json({
          ok: 1,
          data: r
        });
      }).catch((err) => res.status(500).send(err));
  },
  getClient: (req, res) => {
    var id = req.params.id;
    var query = {
      _id: id
    };

    findClient(query)
      .then((r) => res.json({
        ok: 1,
        data: r
      }))
      .catch((err) => res.status(500).send(err));

  },
  getClients: (req, res) => {
    var searchField = req.query.by;
    var id = req.query.id;
    var query = {};

    if (searchField == "name" ||
      searchField == "mail" ||
      searchField == "rfc") {
      console.log("asdasd");
      query = {
        [searchField]: {
          $regex: ".*" + id + ".*",
          $options: 'i'
        }
      }
    }


    findClient(query)
      .then((r) => res.json({
        ok: 1,
        data: r
      }))
      .catch((err) => res.status(500).send(err));
  },
  queryClient: (id) => {
    var query = {
      _id: id
    };

    return findClient(query)
  }

}

module.exports = c;
