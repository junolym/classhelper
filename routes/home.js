var express = require('express');
var cm = require('../plugins/cookie-manager.js');
var url = require('url');
var router = express.Router();
var crypto = require('crypto');
require('json-tryparse');
var dao = require('../dao/dao.js');

router.get('/course', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        dao.getcoursebyaccount(cm.getCookie(req.cookies.id))
        .then(function(result) {
            var courses = JSON.tryParse(JSON.stringify(result));
            res.render('home/course', { title: '课程列表', courses: courses });
        }).catch(function(err) {
            res.render('error', { error: err });
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/signin', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        dao.getsignbyaccount(cm.getCookie(req.cookies.id))
        .then(function(result) {
            var signin = JSON.tryParse(JSON.stringify(result));
            signin.forEach(function(s) {
                s.time = (new Date(s.time)).toLocaleString('zh-CN', { hour12 : false })
                    .replace(/[\/|-]/, '年').replace(/[\/|-]/, '月').replace(/ /, '日 ');
            });
            res.render('home/signin', { title: '签到列表', signin: signin });
        }).catch(function(err) {
            res.render('error', { error: err });
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
        var params = url.parse(req.url, true).query;
        dao.addcourse(cm.getCookie(req.cookies.id), req.body.form_coursename, req.body.form_coursetime, req.body.form_courseinfo)
        .then(function(result) {
            var students = JSON.tryParse(req.body.students);
            var studentsMap = {};
            var studentsArray = [];
            if (!students.stack && typeof(students) == 'object') {
                for (var i = 0; i < students.length; i++) {
                    students[i][0] = parseInt(students[i][0]);
                    if (!isNaN(students[i][0])
                        && students[i][0].toString().length <= 15
                        && students[i][1].length <= 40) {
                        studentsMap[students[i][0]] = students[i][1];
                    }
                }
                for (var i in studentsMap) {
                    studentsArray.push([i, studentsMap[i]]);
                }
            } else {
                return Promise.reject( { stack: '用户学号格式错误', status: 500});
            }
            if(studentsArray.length) {
                dao.addstutocourse(req.query.id, studentsArray);
            }
            res.render('home/reload', { location : 'course' });
        }).catch(function(err) {
            res.render('error', { error : err });
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/signindetail', function(req, res, next) {
    //TODO
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        dao.checksign(cm.getCookie(req.cookies.id), params.cid, params.sid)
        .then(function(err) {
            return dao.getsignbyid(params.sid)
        }).then(function(result) {
            var signindetail = JSON.tryParse(JSON.stringify(result));
            signindetail.forEach(function(s) {
                s.time = (new Date(s.time)).toLocaleString('zh-CN', { hour12 : false })
                    .replace(/[\/|-]/, '年').replace(/[\/|-]/, '月').replace(/ /, '日 ');
            });
            res.render('home/signindetail', { course_id : params.cid, signin_id : params.sid, signindetail: signindetail });
        }).catch(function(err) {
            res.render('error', { error : err });
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});


router.post('/editcourse', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        var students = JSON.tryParse(req.body.students);
        var studentsMap = {};
        var studentsArray = [];
        dao.updatecourse(req.query.id, req.body.form_coursename, req.body.form_coursetime, req.body.form_courseinfo)
        .then(function(result) {
            if (!students.stack && typeof(students) == 'object') {
                for (var i = 0; i < students.length; i++) {
                    students[i][0] = parseInt(students[i][0]);
                    if (!isNaN(students[i][0])
                        && students[i][0].toString().length <= 15
                        && students[i][1].length <= 40) {
                        studentsMap[students[i][0]] = students[i][1];
                    }
                }
                for (var i in studentsMap) {
                    studentsArray.push([i, studentsMap[i]]);
                }
            } else {
                return Promise.reject({stack: '用户学号格式错误', status: 500});
            }
            return dao.delstuofcourse(req.query.id);
        }).then(function(result) {
            return dao.addstutocourse(req.query.id, studentsArray);
        }).then(function() {
            res.render('home/reload', { location : 'course' });
        }).catch(function(err) {
            res.render('error', { error : err });
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/deletecourse', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        courseId = params.id;
        dao.checkcourse(cm.getCookie(req.cookies.id), courseId)
        .then(function() {
            return dao.delcourse(cm.getCookie(req.cookies.id), courseId);
        }).then(function() {
            res.render('home/reload', { location : 'course' });
        }).catch(function(err) {
            res.render('error', { error : err });
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/coursedetail', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        var coursedetail
        dao.checkcourse(cm.getCookie(req.cookies.id), params.id)
        .then(function(result) {
            return dao.getcoursebyid(params.id)
        }).then(function(result){
            coursedetail = JSON.tryParse(JSON.stringify(result))[0];
            coursedetail.course_id = params.id;
            return dao.getstubycourse(params.id);
        }).then(function(studentresult) {
            var student = JSON.tryParse(JSON.stringify(studentresult));
            coursedetail.students = student;
            res.render('home/coursedetail', coursedetail);
        }).catch(function(err) {
            res.render('error', { error : err });
            // 检查出错
            // res.render('home/redirect', { location : '/login' });
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

router.get('/deletesignin', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        dao.checksign(cm.getCookie(req.cookies.id), params.cid, params.sid)
        .then(function(result) {
            return dao.delsign(params.sid);
        }).then(function(result) {
            res.render('home/reload', { location : 'signin' });
        }).catch(function(err) {
            res.render('error', { error : err });
        });
    } else {
        res.render('home/redirect', { location : '/login' });
    }
});

module.exports = router;
