var express = require('express');
var router = express.Router();
var item = require('../models/item');
var helper = require('../models/helper');

router.get('/get', function (req, res, next) {
    item.get(req, res, next);
});

router.post('/add', function (req, res, next) {
    item.add(req, res, next);
});
router.post('/delete', function (req, res, next) {
    item.delete(req, res, next);
});
router.post('/update/cost', function (req, res, next) {
    item.updateCost(req, res, next);
});


// router.post('/current/question', helper.verifyToken, function (req, res, next) {
//     user.currentQuestion(req, res, next);
// });



module.exports = router;