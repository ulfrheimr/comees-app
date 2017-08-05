var express = require('express');

var CatController = require('../controllers/cat');
var MIController = require('../controllers/mi');
var PhysComissionController = require('../controllers/comm')
var RefController = require('../controllers/ref');
// var SaleController = require('../controllers/sale');
// var InvoicedMIController = require('../controllers/invoiced-mis');
// var FacturerController = require('../controllers/facturer');


var router = express.Router();
var app = express();


router.route('/cats')
  // {name}
  .put(CatController.putCat)
  .get(CatController.getCats);

router.route('/mis')
  // {name, catId, price, desc, delivery, sample}
  .put(MIController.putMI)
  .get(MIController.getMIs);

router.route('/comms')
  // physId,bottom,perc
  .put(PhysComissionController.putPhysComission);

router.route('/discount/:phys_id')
  .get(RefController.getPhysDiscount);

router.route('/phys_mis')
  // id_phys, id_mi, price
  // Id is sent, no code
  .put(RefController.putPhysMI);


// router.route('/sales')
//   // usr
//   .put(SaleController.putSale)
//   // id_sale, qty, mi, sale_price,price_discount, type_discount, discount,
//   .post(SaleController.addMis)
//   .get(SaleController.getSales);
//
// router.route('/sales/:id')
//   .get(SaleController.getSale)
//
//
// router.route('/invoices')
// // .put(InvoicedMIController.putMi)
// // .get(InvoicedMIController.getMis);
//
// router.route('/facturers')
//   // {name}
//   .put(FacturerController.putFacturer)
//   .get(FacturerController.getFacturers);

//
// router.route('/invoiced_mis')
//   .put(InvoicedMIController.putMi)
//   .get(InvoicedMIController.getMis);

//
// router.route('/phys_mis/:phys_id')
//   .get(PhysMiController.getPhysMI);




module.exports = router;
