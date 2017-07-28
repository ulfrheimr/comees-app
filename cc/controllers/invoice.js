var Invoice = require('../models/invoice');
var ClientController = require('./client');

var paymentWay = {
  "01": "Efectivo",
  "02": "Cheque nominativo",
  "03": "Transferencia electrónica de fondos",
  "04": "Tarjeta de crédito",
  "05": "Monedero electrónico",
  "06": "Dinero electrónico",
  "08": "Vales de despensa",
  "12": "Dación en pago",
  "13": "Pago por subrogación",
  "14": "Pago por consignación",
  "15": "Condonación",
  "17": "Compensación",
  "23": "Novacion",
  "24": "Confusión",
  "25": "Remisión de deuda",
  "26": "Prescripción o caducidad",
  "27": "A satisfacción del acreedor",
  "28": "Tarjeta de débito",
  "29": "Tarjeta de servicios",
  "30": "Aplicación de anticipos",
  "99": "Por definir"
}

var types = {
  "mi": "Estudios y análisis",
  "ph": "Farmacia"
}

var saveInvoice = (invoice) => {
  return new Promise((resolve, reject) => {
    var i = new Invoice();

    i.client = invoice.client;
    i.sale = invoice.sale;
    i.type = invoice.type;
    i.paymentType = invoice.paymentType;
    i.paymentMethod = "PUE";
    i.paymentAccount = invoice.paymentAccount;
    i.timestamp = new Date();
    i.is_invoiced = false;

    i.save((err, invoice) => {
      if (err) reject(err);

      resolve(invoice);
    });
  });
}

var setAsInvoiced = (invoice) => {
  return new Promise((resolve, reject) => {
    Invoice.findOneAndUpdate({
      _id: invoice
    }, {
      is_invoiced: true
    }, {
      upsert: true
    }, function(err, i) {
      if (err) reject(err);

      console.log(i);
      return resolve(i);
    });
  });
}

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
    var paymentType = req.body.paymentType;
    var account = paymentType != "01" ?
      req.body.account : null;


    if (paymentWay[paymentType] == null)
      res.status(500).send("Método de pago inválido");

    if (types[type] == null)
      res.status(500).send("Tipo de facturación inválido");

    if (id_client == undefined) {
      console.log("Here");
      saveInvoice({
          client: null,
          sale: id_sale,
          type: type,
          paymentType: "01"
        })
        .then((invoice) => {
          res.json({
            ok: 1,
            data: invoice
          });
        })
        .catch((err) => res.status(500).send(err))

    } else {
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
                  type: type,
                  paymentType: paymentType,
                  paymentAccount: account
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

        }).catch((err) => res.status(500).send(err));
    }
  },
  getInvoices: (req, res) => {
    var init = req.query.init || "";
    var end = req.query.end || "";
    var invoiced = req.query.invoiced || "";
    var client = req.query.client || "";

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
    if (client != "")
      query["client"] = {
        $ne: null
      };

    findInvoices(query)
      .then(is => {
        res.json({
          ok: 1,
          data: is
        })
      })
      .catch((err) => res.status(500).send(err));

  },
  markAsInvoiced: (req, res) => {
    var id_invoice = req.body.invoice;

    setAsInvoiced(id_invoice)
      .then((i) => {
        res.json({
          ok: 1,
          data: i
        });
      })
      .catch((err) => res.status(500).send(err));
  }
}

module.exports = i;
