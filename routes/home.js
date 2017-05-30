var express = require('express');
var router = express.Router();
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');

router.get('/user', (req, res, next) => {
    var data = {};
    helper.checkLogin(req).then((user) => {
        Object.assign(data, req.session);
        return dao.getcoursebyaccount(user);
    }).then((result) => {
        data.courses = JSON.parse(JSON.stringify(result));
        data.courses = data.courses.slice(0,1);
        return dao.getsignbyaccount(data.user);
    }).then((result) => {
        data.signins = JSON.parse(JSON.stringify(result)).slice(0,4);
        data.signins.forEach(helper.dateConverter());
        return dao.getexambyaccount(data.user);
    }).then((result) => {
        data.exams = JSON.parse(JSON.stringify(result)).slice(0,4);
        res.render('home/user', data);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/help', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        res.render('home/help');
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/course', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.getcoursebyaccount(user);
    }).then((result) => {
        var courses = JSON.parse(JSON.stringify(result));
        res.render('home/course', { title: '课程列表', courses: courses });
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/signin', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.getsignbyaccount(user);
    }).then((result) => {
        var signin = JSON.parse(JSON.stringify(result));
        signin.forEach(helper.dateConverter());
        res.render('home/signin', { title: '签到列表', signin: signin });
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/exam', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.getexambyaccount(user);
    }).then((result) => {
        res.render('home/exam', { title: '测验列表', exam: result });
    }).catch(helper.catchError(req, res, next, true));
});

module.exports = router;
