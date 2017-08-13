var express = require('express');

var PhysController = require('../controllers/phys');
var CouponController = require('../controllers/coupon');
var UsedCouponController = require('../controllers/used-coupon');
var ClientController = require('../controllers/client');
var InvoiceController = require('../controllers/invoice');
var UsrController = require('../controllers/usr');
var LoginController = require('../controllers/login');

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
  // TO SEND AN ARRAY LIKE cats, use cats[]
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
  // id_client,id_sale, type, paymentType
  .put(InvoiceController.putInvoice)
  // init, end, invoiced, client
  .get(InvoiceController.getInvoices)
  .post(InvoiceController.markAsInvoiced);

router.route('/usrs')
  // name, usr, pass, role
  .put(UsrController.putUsr)
  .get(UsrController.getUsrs);

  router.route('/usrs_info')
    .get(UsrController.getUsrInfo);

router.route('/usrs/:id')
  // name, usr, pass, role
  .get(UsrController.getUsr);

router.route('/login')
  // usr, pass
  .post(LoginController.login)

module.exports = router;
