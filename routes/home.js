var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');
var cm = require('../plugins/cookie-manager.js');

router.get('/course', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.getcoursebyaccount(user);
    }).then((result) => {
        var courses = JSON.parse(JSON.stringify(result));
        res.render('home/course', { title: '课程列表', courses: courses });
    }).catch(helper.catchError(res));
});

router.get('/signin', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.getsignbyaccount(user);
    }).then((result) => {
        var signin = JSON.parse(JSON.stringify(result));
        signin.forEach(helper.dateConverter);
        res.render('home/signin', { title: '签到列表', signin: signin });
    }).catch(helper.catchError(res));
});

router.get('/exam', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        res.render('home/exam', { title: '测验列表' });
    }).catch(helper.catchError(res));
});

router.get('/addcourse', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        res.render('home/coursedetail', { title: '添加课程' });
    }).catch(helper.catchError(res));
});

router.post('/addcourse', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.addcourse(user, req.body.form_coursename, req.body.form_coursetime, req.body.form_courseinfo);
    }).then((cid) => {
        return helper.parseStu(cid, req.body.students);
    }).then((result) => {
        if (result.stuArray.length) {
            return dao.addstutocourse(result.cid, result.stuArray);
        }
    }).then(() => {
        res.render('home/reload', { location : 'course' });
    }).catch(helper.catchError(res));
});

router.get('/signindetail', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid)
    }).then(() => {
        return dao.getsignbyid(req.query.sid)
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        result.forEach(helper.dateConverter);
        res.render('home/signindetail', { course_id : req.query.cid, signin_id : req.query.sid, signindetail: result });
    }).catch(helper.catchError(res));
});


router.post('/editcourse', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.checkcourse(user, req.query.id);
    }).then(() => {
        return dao.updatecourse(req.query.id, req.body.form_coursename,
            req.body.form_coursetime, req.body.form_courseinfo);
    }).then(() => {
        return dao.delstuofcourse(req.query.id);
    }).then(() => {
        return helper.parseStu(req.query.id, req.body.students);
    }).then((result) => {
        if (result.stuArray.length) {
            return dao.addstutocourse(result.cid, result.stuArray);
        }
    }).then(() => {
        res.render('home/reload', { location : 'course' });
    }).catch(helper.catchError(res));
});

router.get('/deletecourse', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.checkcourse(user, req.query.id);
    }).then(() => {
        return dao.delcourse(req.query.id);
    }).then(() => {
        res.render('home/reload', { location : 'course' });
    }).catch(helper.catchError(res));
});

router.get('/coursedetail', (req, res, next) => {
    var coursedetail = {};
    helper.checkCookie(req, res).then((user) => {
        return dao.checkcourse(user, req.query.id);
    }).then(() => {
        return dao.getcoursebyid(req.query.id);
    }).then((result) => {
        coursedetail = JSON.parse(JSON.stringify(result))[0];
        coursedetail.course_id = req.query.id;
        return dao.getstubycourse(req.query.id);
    }).then((result) => {
        coursedetail.students = JSON.parse(JSON.stringify(result));
        res.render('home/coursedetail', coursedetail);
    }).catch(helper.catchError(res));
});

router.get('/deletesignin', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid)
    }).then(() => {
        return dao.delsign(req.query.sid);
    }).then(() => {
        res.render('home/reload', { location : 'signin' });
    }).catch(helper.catchError(res));
});

router.get('/createsignin', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.addsign(req.query.cid);
    }).then((result) => {
        crypto.randomBytes(4, (ex, buf) => {
            var token = buf.toString('hex');
            cm.add(token, { cid: req.query.cid, sid: result });
            res.redirect('/qrcode?id='+token);
        });
    }).catch(helper.catchError(res));
});

router.get('/showqrcode', (req, res, next) => {
    helper.checkCookie(req, res).then((user) => {
        return dao.checksign(cm.getCookie(req.cookies.id), req.query.cid, req.query.sid);
    }).then(() => {
        crypto.randomBytes(4, (ex, buf) => {
            var token = buf.toString('hex');
            cm.add(token, { cid: req.query.cid, sid: req.query.sid });
            res.redirect('/qrcode?id='+token);
        });
    }).catch(helper.catchError(res));
});

module.exports = router;
