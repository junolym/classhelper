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
    if (req.cookies && cm.check(req.cookies.id)) {
        dao.getcoursebyaccount(cm.getCookie(req.cookies.id), function(err, result) {
            if (!err) {
                var courses = JSON.parse(JSON.stringify(result));
                res.render('content/index-course', { title: '课程列表', courses: courses });
            } else {
                res.render('error', { error: err });
            }
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/index/signin', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        dao.getsignbyaccount(cm.getCookie(req.cookies.id), function(err, result) {
            if (!err) {
                var signin = JSON.parse(JSON.stringify(result));
                signin.forEach(function(s) {
                    s.time = (new Date(s.time)).toLocaleString('zh-CN', { hour12 : false })
                        .replace(/[\/|-]/, '年').replace(/[\/|-]/, '月').replace(/ /, '日 ');
                });
                res.render('content/index-signin', { title: '签到列表', signin: signin });
            } else {
                res.render('error', { error: err });
            }
        })
    } else {
        res.redirect('/login');
    }
});

router.get('/index/exam', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.render('content/index-exam', { title: '测验列表' });
    } else {
        res.redirect('/login');
    }
});

router.get('/index/addcourse', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.render('content/index-addcourse', { title: '添加课程' });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
