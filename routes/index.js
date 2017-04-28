var express = require('express');
var cm = require('../plugins/cookie-manager.js');
var router = express.Router();
var dao = require('../dao/dao.js');
router.get('/', function(req, res, next) {
  if (req.cookies && cm.check(req.cookies.id)) {
    res.render('index', { title: 'Classhelper', user: cm.getCookie(req.cookies.id) });
  } else {
    res.redirect('/login');
  }
});

router.get('/index/course', function(req, res, next) {
    var courses = [];
    if (req.cookies && cm.check(req.cookies.id)) {
        dao.getcoursebyaccount(cm.getCookie(req.cookies.id), function(err, result){
            if (err) {
                console.log(err);
            }
            else if (!result) {
                console.log("result为空");
            }
            else {
            var json = JSON.parse(JSON.stringify(result));
            res.render('content/index-course', { title: '课程列表', courses: json });
            }
        })
    }
    
    
});

router.get('/index/signin', function(req, res, next) {
    res.render('content/index-signin', { title: '签到列表' });
});

router.get('/index/exam', function(req, res, next) {
    res.render('content/index-exam', { title: '测验列表' });
});

module.exports = router;
