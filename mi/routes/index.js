var express = require('express');

var CatController = require('../controllers/cat');
var MIController = require('../controllers/mi');
var PhysComissionController = require('../controllers/phys-comission')
var PhysMiController = require('../controllers/phys-mi');
var SaleController = require('../controllers/sale');
var InvoicedMIController = require('../controllers/invoiced-mis');
var FacturerController = require('../controllers/facturer');


var router = express.Router();
var app = express();


router.route('/cats')
  // {name}
  .put(CatController.putCat)
  .get(CatController.getCats);

router.route('/facturers')
  // {name}
  .put(FacturerController.putFacturer)
  .get(FacturerController.getFacturers);

router.route('/mis')
  // {name, catId, price, desc, delivery, sample}
  .put(MIController.putMI)
  .get(MIController.getMIs);

router.route('/invoiced_mis')
  .put(InvoicedMIController.putMi)
  .get(InvoicedMIController.getMis);

router.route('/phys_comissions')
  // physId,bottom,perc
  .put(PhysComissionController.putPhysComission);

router.route('/phys_comissions/:id')
  .get(PhysComissionController.getPhysCommission);

router.route('/phys_mis')
  // id_phys, id_mi, price
  .put(PhysMiController.putPhysMI);

router.route('/phys_mis/:phys_id')
  .get(PhysMiController.getPhysMI);

router.route('/sales')
  // usr
  .put(SaleController.putSale)
  // id_sale, qty, mi, sale_price,price_discount, type_discount, discount,
  .post(SaleController.addMis)
  .get(SaleController.getSales);

router.route('/sales/:id')
  .get(SaleController.getSale)


module.exports = router;
