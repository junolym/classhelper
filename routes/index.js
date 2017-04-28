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
    var courses =
    [{
        name: "软件测试",
        time: "周五 7~9节",
        id: 1
    },{
        name: "系统分析与设计",
        time: "周三 3~5节",
        id: 2
    },{
        name: "程序设计二",
        time: "周四 7~8节",
        id: 3
    }]
    res.render('content/index-course', { title: '课程列表', courses: courses });
});

router.get('/index/signin', function(req, res, next) {
    res.render('content/index-signin', { title: '签到列表' });
});

router.get('/index/exam', function(req, res, next) {
    res.render('content/index-exam', { title: '测验列表' });
});

module.exports = router;
