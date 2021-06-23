var express = require('express');
var router = express.Router();

/* Home page / index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
