var express = require('express');

var CatController = require('../controllers/cat');
var MIController = require('../controllers/mi');
var PhysComissionController = require('../controllers/phys-comission')
var PhysMiController = require('../controllers/phys-mi');
var SaleController = require('../controllers/sale');


var router = express.Router();
var app = express();


router.route('/cats')
  // {name}
  .put(CatController.putCat);

router.route('/mis')
  // {name, catId, price, desc}
  .put(MIController.putMI)
  .get(MIController.getMIs);

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
  .put(SaleController.putSale)
  // id_sale, qty, mi, sale_price,price_discount, type_discount, discount,
  .post(SaleController.addMis)
  .get(SaleController.getSales);

router.route('/sales/:id')
  .get(SaleController.getSale)





module.exports = router;
