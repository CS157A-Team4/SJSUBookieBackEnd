var express = require('express');
var router = express.Router();
var connection = require('./database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SJSUBookie Endpoints' });
});

module.exports = router;
