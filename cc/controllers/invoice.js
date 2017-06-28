var Invoice = require('../models/invoice');
var ClientController = require('./client');

var saveInvoice = (invoice) => {
  return new Promise((resolve, reject) => {
    var i = new Invoice();

    i.client = invoice.client;
    i.sale = invoice.sale;
    i.type = invoice.type;
    i.timestamp = new Date();
    i.is_invoiced = false;

    i.save((err, invoice) => {
      if (err) reject(err);

      resolve(invoice);
    });
  });
}

var u

var findInvoices = (query) => {
  console.log(query);
  return new Promise((resolve, reject) => {
    Invoice.find(query)
      .exec((err, is) => {
        if (err) reject(err);

        resolve(is);
      });
  });
}

var i = {
  putInvoice: (req, res) => {
    var id_client = req.body.id_client;
    var id_sale = req.body.id_sale;
    var type = req.body.type;

    ClientController.queryClient(id_client)
      .then(c => {
        if (c.length != 1)
          throw "NO client found";

        c = c[0];

        var query = {
          sale: id_sale
        };

        findInvoices(query)
          .then(invoice => {
            if (invoice.length != 0) {
              res.json({
                ok: 0,
                message: "Already invoiced"
              })
            }

            saveInvoice({
                client: c._id,
                sale: id_sale,
                type: type
              })
              .then((invoice) => {
                res.json({
                  ok: 1,
                  data: invoice
                });
              })
              .catch((err) => res.status(500).send(err))
          })
          .catch((err) => res.status(500).send(err));

      }).catch((err) => res.status(500).send(err))
  },
  getInvoices: (req, res) => {
    var init = req.query.init || "";
    var end = req.query.end || "";
    var invoiced = req.query.invoiced || "";

    var query = {}

    if (init != "" && end != "")
      query["$and"] = [{
          timestamp: {
            // min sec millis
            $gte: init
          }
        },
        {
          timestamp: {
            $lte: end
          }
        }
      ];

    if (invoiced != "")
      query["is_invoiced"] = JSON.parse(invoiced);

    findInvoices(query)
      .then(is => {
        res.json({
          ok: 1,
          data: is
        })
      })
      .catch((err) => res.status(500).send(err));

  }
}

module.exports = i;
