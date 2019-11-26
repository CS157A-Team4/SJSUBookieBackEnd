var express = require('express');
var router = express.Router();
var connection = require('../database');


router.get('/', function(req, res, next) {
    res.send('Post api is working properly');
});

module.exports = router;