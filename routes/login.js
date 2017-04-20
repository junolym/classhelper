var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login - Classhelper' });
});

router.post('/', function(req, res, next) {
  // login success
  res.redirect('/');
});


module.exports = router;
