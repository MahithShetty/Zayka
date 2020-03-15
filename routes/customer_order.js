var express = require('express');
var router = express.Router();
var customer_order = require('../models/customer_order');
var helper = require('../models/helper');

router.get('/get', function (req, res, next) {
    customer_order.get(req, res, next);
});

router.post('/add', function (req, res, next) {
    customer_order.add(req, res, next);
});
router.post('/status/location', function (req, res, next) {
    customer_order.updateStatusLocation(req, res, next);
});
router.get('/getAll', function (req, res, next) {
    customer_order.getAll(req, res, next);
});
router.post('/status', function (req, res, next) {
    customer_order.updateStatus(req, res, next);
});



module.exports = router;