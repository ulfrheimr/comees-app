var express = require('express');

var PresentationController = require('../controllers/presentation');
var LabController = require('../controllers/lab');
var SSAController = require('../controllers/ssa');
var DrugController = require('../controllers/drug');
var StockController = require('../controllers/stock');
var BuyPlaceController = require('../controllers/buy-place');
var PurchaseController = require('../controllers/purchase');
var SaleController = require('../controllers/sale');

var router = express.Router();
var app = express();


router.route('/press')
  // presentation
  .put(PresentationController.putPresentation)
  .get(PresentationController.getPresentations);

router.route('/labs')
  // lab
  .put(LabController.putLab)
  .get(LabController.getLabs);

router.route('/ssas')
  .get(SSAController.getSSAs);

router.route('/drugs')
  // code, name, substance, id_presentation, dosage, qty,
  // id_lab, sale_price, max_price, cat, ssa, desc, follow
  .put(DrugController.putDrug)
  .get(DrugController.getDrugs)

router.route('/drugs/:id')
  .get(DrugController.getDrug);

router.route('/stock/:id')
  .get(StockController.getStock);

router.route('/buy_places')
  // place, phone, mail, contact
  .put(BuyPlaceController.putBuyPlace)
  .get(BuyPlaceController.getBuyPlaces);

router.route('/purchases')
  // buy_place
  .put(PurchaseController.putPurchase)
  // id_purchase, qty, id_drug, price
  .post(PurchaseController.addDrug)
  .get(PurchaseController.getPurchases);

router.route('/purchases/:id')
  .get(PurchaseController.getPurchase);

router.route('/sales')
  // usr
  .put(SaleController.putSale)
  // id_sale, qty, drug, sale_price, price_discount, type_discount, discount,
  .post(SaleController.addDrugs)
  .get(SaleController.getSales);

router.route('/sales/:id')
  .get(SaleController.getSale);



module.exports = router;
