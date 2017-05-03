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
        res.render('home/coursedetail', { title: '添加课程' });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.post('/addcourse', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        dao.addcourse(cm.getCookie(req.cookies.id), req.body.form_coursename, req.body.form_coursetime, req.body.form_courseinfo, function(err, result) {
            if (!err) {
                res.render('home/reload', { location : 'course' });
            } else {
                res.render('error', { error : err });
            }
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/signindetail', function(req, res, next) {
    //TODO
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
                        res.render('home/signindetail', { course_id : params.cid, signin_id : params.sid, signindetail: signindetail });
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


router.post('/editcourse', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        dao.updatecourse(req.query.id, req.body.form_coursename, req.body.form_coursetime, req.body.form_courseinfo, function(err, result){
            if (!err) {
                res.render('home/reload', { location : 'course' });
            } else {
                res.render('error', { error : err });
            }
        });

    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/deletecourse', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        courseId = params.id;
        dao.checkcourse(cm.getCookie(req.cookies.id), courseId, function(err) {
            if (!err) {
                dao.delcourse(cm.getCookie(req.cookies.id), courseId, function(err){
                    if (!err) {
                        res.render('home/reload', { location : 'course' });
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

router.get('/coursedetail', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        dao.checkcourse(cm.getCookie(req.cookies.id), params.id, function(err, result) {
            if (!err) {
                dao.getcoursebyid(params.id, function(err, result){
                    if (!err) {
                        var coursedetail = JSON.parse(JSON.stringify(result))[0];
                        coursedetail.course_id = params.id;
                        dao.getstubycourse(params.id, function(err, studentresult){
                            if (!err) {
                                var student = JSON.parse(JSON.stringify(studentresult));
                                coursedetail.students = student;
                                res.render('home/coursedetail', coursedetail);
                            }
                            else {
                                res.render('error', { error : err });
                            }
                        })
                    } else {
                        res.render('error', { error : err });
                    }
                })
            } else {
                res.render('home/redirect', { location : '/login' });
            }
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/deletesignin', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        dao.checksign(cm.getCookie(req.cookies.id), params.cid, params.sid, function(err, result) {
            if (!err) {
                // dao.delsign(params.sid, function(err) {
                    if (!err) {
                        res.render('home/reload', { location : 'signin' });
                    } else {
                        res.render('error', { error : err });
                    }
                // });
            } else {
                res.render('error', { error : err });
            }
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

module.exports = router;
