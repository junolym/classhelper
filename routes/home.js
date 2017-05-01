var express = require('express');
var cm = require('../plugins/cookie-manager.js');
var url = require('url');
var router = express.Router();
var crypto = require('crypto');
var dao = require('../dao/dao.js');

router.get('/course', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        dao.getcoursebyaccount(cm.getCookie(req.cookies.id), function(err, result) {
            if (!err) {
                var courses = JSON.parse(JSON.stringify(result));
                res.render('home/course', { title: '课程列表', courses: courses });
            } else {
                res.render('error', { error: err });
            }
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/signin', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        dao.getsignbyaccount(cm.getCookie(req.cookies.id), function(err, result) {
            if (!err) {
                var signin = JSON.parse(JSON.stringify(result));
                signin.forEach(function(s) {
                    s.time = (new Date(s.time)).toLocaleString('zh-CN', { hour12 : false })
                        .replace(/[\/|-]/, '年').replace(/[\/|-]/, '月').replace(/ /, '日 ');
                });
                res.render('home/signin', { title: '签到列表', signin: signin });
            } else {
                res.render('error', { error: err });
            }
        })
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/exam', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.render('home/exam', { title: '测验列表' });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/addcourse', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.render('home/addcourse', { title: '添加课程' });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/signindetail', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        dao.checksign(cm.getCookie(req.cookies.id), params.cid, params.sid, function(err) {
            if (!err) {
                dao.getsignbyid(params.sid, function(err, result) {
                    if (!err) {
                        var signindetail = JSON.parse(JSON.stringify(result));
                        signindetail.forEach(function(s) {
                            s.time = (new Date(s.time)).toLocaleString('zh-CN', { hour12 : false })
                                .replace(/[\/|-]/, '年').replace(/[\/|-]/, '月').replace(/ /, '日 ');
                        });
                        res.render('home/signindetail', { signindetail: signindetail });
                    } else {
                        res.render('error', { error : err });
                    }
                });
            } else {
                res.render('error', { error : err });
            }
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

module.exports = router;
