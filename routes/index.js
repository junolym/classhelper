var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*  if login, render index
   *  else redirect to login page
   */
  // 把0换成登陆状态
  if (0) {
    res.render('index', { title: 'Classhelper' });
  } else {
    res.redirect('/login');
  }

});

module.exports = router;
