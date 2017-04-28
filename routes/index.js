var express = require('express');
var cm = require('../plugins/cookie-manager.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.cookies && cm.check(req.cookies.id)) {
    res.render('index', { title: 'Classhelper', user: cm.getCookie(req.cookies.id) });
  } else {
    res.redirect('/login');
  }
});

router.get('/index/course', function(req, res, next) {
    res.render('content/index-course', { title: '课程列表' });
});

router.get('/index/signin', function(req, res, next) {
    res.render('content/index-signin', { title: '签到列表' });
});

router.get('/index/exam', function(req, res, next) {
    res.render('content/index-exam', { title: '测验列表' });
});

module.exports = router;
