var express = require('express');
var router = express.Router();
var item_order = require('../models/item_order');
var helper = require('../models/helper');

router.get('/get', function (req, res, next) {
    item_order.get(req, res, next);
});

router.post('/add', function (req, res, next) {
    item_order.add(req, res, next);
});
router.post('/update/location', function (req, res, next) {
    item_order.updateLocation(req, res, next);
});

router.get('/frequently/sold', function (req, res, next) {
    item_order.frequentlySold(req, res, next);
});

// router.post('/current/question', helper.verifyToken, function (req, res, next) {
//     user.currentQuestion(req, res, next);
// });



module.exports = router;