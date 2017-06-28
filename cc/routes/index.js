var express = require('express');

var PhysController = require('../controllers/phys');
var CouponController = require('../controllers/coupon');
var UsedCouponController = require('../controllers/used-coupon');
var ClientController = require('../controllers/client');
var InvoiceController = require('../controllers/invoice');

var router = express.Router();
var app = express();

router.route('/clients')
  // name, rfc, phone, mail, address
  .put(ClientController.putClient)
  .get(ClientController.getClients);

router.route('/clients/:id')
  .get(ClientController.getClient);

router.route('/physs')
  // {mail, code, phone, address, external, name, first, last, rfc, account}
  .put(PhysController.putPhys)
  .get(PhysController.getPhyss);

router.route('/physs/:id')
  // by=code|mail|id=default
  .get(PhysController.getPhys);

router.route('/coupons')
  // code, cats, init_date, end_date, discount, description
  // We need a cats revision for availables cats
  .put(CouponController.putCoupon)
  //init_date, end_date
  .get(CouponController.getCouponByDate);

router.route('/coupons/:code')
  // Coupon is getting by code
  .get(CouponController.getCoupon);

router.route('/used_coupons')
  // coupon,sale,type
  // We need a type revision for availables
  .put(UsedCouponController.putCoupon)
  .get(UsedCouponController.getCouponByDate);

router.route('/invoices')
  // id_client,id_sale, type
  .put(InvoiceController.putInvoice)
  // init, end, invoiced
  .get(InvoiceController.getInvoices);



module.exports = router;
