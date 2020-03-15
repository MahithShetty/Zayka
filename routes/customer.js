var express = require('express');
var router = express.Router();
var customer = require('../models/customer');
var helper = require('../models/helper');

router.get('/get', function (req, res, next) {
    customer.get(req, res, next);
});

router.post('/add', function (req, res, next) {
    customer.add(req, res, next);
});

router.get('/login', function (req, res, next) {
    customer.userLogin(req, res, next);
});
router.post('/role', function (req, res, next) {
    customer.updateRole(req, res, next);
});


module.exports = router;