var express = require('express');
var router = express.Router();
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');
var qrcode = require('../plugins/qrcode-manager.js');
var examManager = require('../plugins/exam-manager.js');

router.get('/user', (req, res, next) => {
    var data = {};
    helper.checkLogin(req).then((user) => {
        data.user = user;
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
        res.status(207).send(JSON.stringify({
            reload: '#course',
            notify: ['课程添加成功', 'success']
        }));
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/signindetail', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid)
    }).then(() => {
        return dao.getsignbyid(req.query.sid)
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        result.forEach(helper.dateConverter());
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
        res.status(207).send(JSON.stringify({
            reload: '#course',
            notify: ['课程修改成功', 'success']
        }));
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/deletecourse', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.delcourse(req.query.cid);
    }).then(() => {
        res.status(207).send(JSON.stringify({
            reload: '#course',
            notify: ['课程已删除', 'success']
        }));
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
        res.status(207).send(JSON.stringify({
            reload: '#signin',
            notify: ['签到记录已删除', 'success']
        }));
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
        var response = {
            reload: '#exam',
            notify: ['测验创建成功', 'success']
        }
        res.status(207).send(JSON.stringify(response));
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/deleteexam', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.deleteExam(req.query.eid);
    }).then(() => {
        res.status(207).send(JSON.stringify({
            reload: '#exam',
            notify: ['测验已删除', 'success']
        }));
    }).catch(helper.catchError(req, res, next, true));
});


router.get('/editexam', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((result) => {
        res.render('home/examdetail', result);
    }).catch(helper.catchError(req, res, next, true));
});

router.post('/editexam', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        var examname = req.body.examname || 'untitled';
        return examManager.editExam(req.query.eid, examname, JSON.parse(req.body.exam));
    }).then(() => {
        var response = {
            reload: '#exam',
            notify: ['测验修改成功', 'success']
        }
        res.status(207).send(JSON.stringify(response));
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/submitlist', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getAnswers(req.query.eid);
    }).then((result) => {
        res.render('home/submitlist', {
            course_id: req.query.cid,
            exam_id: req.query.eid,
            submitlist: result
        });
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/examresult', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid, req.query.student);
    }).then((result) => {
        res.render('home/examresult', result);
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

router.get('/courseinfo', (req, res, next) => {
    var data = {
        onlystu : req.query.only == 'stu',
        course_id : req.query.cid
    };
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.statssignbycourse(req.query.cid);
    }).then((result) => {
        data.students = JSON.parse(JSON.stringify(result));
        return dao.statsexambycourse(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        for (var i = 0; i < data.students.length || i < result.length; i++) {
            data.students[i] = data.students[i] || {};
            Object.assign(data.students[i], result[i]);
        }
        return dao.getsignbycourse(req.query.cid);
    }).then((result) => {
        data.signins = JSON.parse(JSON.stringify(result)).slice(0,3);
        data.signins.forEach(helper.dateConverter());
        return dao.getexambycourse(req.query.cid);
    }).then((result) => {
        data.exams = JSON.parse(JSON.stringify(result)).slice(0,3);
        res.render('home/courseinfo', data);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/studetail', (req, res, next) => {
    var data = {
        course_id : req.query.cid,
        stu_id : req.query.stu,
        sign_total : 0,
        sign_num : 0,
        exam_total: 0,
        exam_num : 0,
        sum_score : 0
    };
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.statssigndetail(req.query.cid, req.query.stu);
    }).then((result) => {
        data.signins = JSON.parse(JSON.stringify(result));
        data.sign_total = data.signins.length;
        data.signins.forEach(s => {
            if (s.stu_time) data.sign_num++;
            helper.dateConverter()(s);
            helper.dateConverter('stu_time')(s);
        });
        return dao.statsexamdetail(req.query.cid, req.query.stu);
    }).then((result) => {
        data.exams = JSON.parse(JSON.stringify(result));
        data.exam_total = data.exams.length;
        data.exams.forEach(e => {
            if (e.time) data.exam_num++;
            data.sum_score += e.score || 0;
            helper.dateConverter()(e);
        });
        res.render('home/studetail', data);
    }).catch(helper.catchError(req, res, next, true));
});

module.exports = router;
