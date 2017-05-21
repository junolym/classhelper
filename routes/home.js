var express = require('express');
var router = express.Router();
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');
var qrcode = require('../plugins/qrcode-manager.js');
var examManager = require('../plugins/exam-manager.js');

router.get('/user', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        res.render('home/user', { user : user });
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
        signin.forEach(helper.dateConverter);
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

router.get('/addcourse', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        res.render('home/coursedetail', { title: '添加课程' });
    }).catch(helper.catchError(req, res, next, true));
});

router.post('/addcourse', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.addcourse(user, req.body.form_coursename, req.body.form_coursetime, req.body.form_courseinfo);
    }).then((cid) => {
        return helper.parseStu(cid, req.body.students);
    }).then((result) => {
        if (result.stuArray.length) {
            return dao.addstutocourse(result.cid, result.stuArray);
        }
    }).then(() => {
        res.status(302).send('#course');
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/signindetail', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid)
    }).then(() => {
        return dao.getsignbyid(req.query.sid)
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        result.forEach(helper.dateConverter);
        res.render('home/signindetail', { course_id : req.query.cid, signin_id : req.query.sid, signindetail: result });
    }).catch(helper.catchError(req, res, next, true));
});


router.post('/editcourse', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.updatecourse(req.query.cid, req.body.form_coursename,
            req.body.form_coursetime, req.body.form_courseinfo);
    }).then(() => {
        return dao.delstuofcourse(req.query.cid);
    }).then(() => {
        return helper.parseStu(req.query.cid, req.body.students);
    }).then((result) => {
        if (result.stuArray.length) {
            return dao.addstutocourse(result.cid, result.stuArray);
        }
    }).then(() => {
        res.status(302).send('#course');
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/deletecourse', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.delcourse(req.query.cid);
    }).then(() => {
        res.status(302).send('#course');
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/coursedetail', (req, res, next) => {
    var coursedetail = {};
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.getcoursebyid(req.query.cid);
    }).then((result) => {
        coursedetail = JSON.parse(JSON.stringify(result))[0];
        coursedetail.course_id = req.query.cid;
        return dao.getstubycourse(req.query.cid);
    }).then((result) => {
        coursedetail.students = JSON.parse(JSON.stringify(result));
        res.render('home/coursedetail', coursedetail);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/deletesignin', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid)
    }).then(() => {
        return dao.delsign(req.query.sid);
    }).then(() => {
        res.status(302).send('#signin');
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/createexam', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        res.render('home/examdetail', { course_id : req.query.cid });
    }).catch(helper.catchError(req, res, next, true));
});

router.post('/createexam', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        var examname = req.body.examname || 'untitled';
        return examManager.createExam(req.query.cid, examname, JSON.parse(req.body.exam));
    }).then(() => {
        res.status(302).send('#exam');
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/deleteexam', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.deleteExam(req.query.eid);
    }).then(() => {
        res.status(302).send('#exam');
    }).catch(helper.catchError(req, res, next, true));
});


router.get('/editexam', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((result) => {
        res.render('home/examdetail', { course_id : req.query.cid });
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/submitlist', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getAnswers(req.query.eid);
    }).then((result) => {
        // just for debugging
        var examstring = JSON.stringify(result);
        res.render('home/submitlist', { submitlist: result, debugstring: examstring });
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/studentanswer', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getStuAnswer(req.query.eid, req.query.student);
    }).then((result) => {
        res.render('home/studentanswer', result);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/statistics', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((exam) => {
        res.send(JSON.stringify(exam.statistics));
    }).catch(helper.catchError(req, res, next, true));
});

module.exports = router;
