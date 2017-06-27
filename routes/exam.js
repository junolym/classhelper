var express = require('express');
var router = express.Router();
var qrcode = require('../controllers/key-manager.js');
var dao = require('../dao/dao.js');
var helper = require('../controllers/route-helper.js');
var examManager = require('../controllers/exam-manager.js');

router.get('/create', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        res.render('home/examdetail', { course_id : req.query.cid });
    }).catch(helper.catchError(req, res, next, true));
});

router.post('/create', (req, res, next) => {
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

router.get('/delete', (req, res, next) => {
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

router.get('/edit', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((result) => {
        res.render('home/examdetail', result);
    }).catch(helper.catchError(req, res, next, true));
});

router.post('/edit', (req, res, next) => {
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
    var data = {
        cid : req.query.cid,
        eid : req.query.eid,
        course_name : ''
    }
    helper.checkLogin(req).then((user) => {
        Object.assign(data, req.session);
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return dao.getcoursebyid(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        data.course_name = result.course_name;
        return examManager.getExam(req.query.eid, req.query.student);
    }).then((result) => {
        Object.assign(data, result);
        return examManager.getAnswers(req.query.eid);
    }).then((result) => {
        data.submitlist = result;
        res.render('home/submitlist', data);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/result', (req, res, next) => {
    var data = {
        cid : req.query.cid,
        course_name : ''
    }
    helper.checkLogin(req).then((user) => {
        Object.assign(data, req.session);
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return dao.getcoursebyid(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        data.course_name = result.course_name;
        return examManager.getExam(req.query.eid, req.query.student);
    }).then((result) => {
        Object.assign(data, result);
        res.render('home/examresult', data);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/studentanswer', (req, res, next) => {
    var data = {
        cid : req.query.cid,
        course_name : ''
    }
    helper.checkLogin(req).then((user) => {
        Object.assign(data, req.session);
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return dao.getcoursebyid(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        data.course_name = result.course_name;
        return examManager.getStuAnswer(req.query.eid, req.query.student);
    }).then((result) => {
        Object.assign(data, result);
        res.render('home/studentanswer', data);
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

router.get('/preview', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((result) => {
        res.render('exam', { preview: true, title: "预览试卷", examname: result.examname, exam: result.questions });
    }).catch(helper.catchError(req, res, next, false, (err) => {
        res.redirect('/result?msg=请求试卷失败&err=' + err.message);
    }));
});

router.get('/showanswer', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((result) => {
        res.render('exam', { preview: true, title: "答案", examname: result.examname, exam: result.questionsWithAnswer } );
    }).catch(helper.catchError(req, res, next, false, (err) => {
        res.redirect('/result?msg=请求试卷失败&err=' + err.message);
    }));
});

router.get('/showqrcode', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        var key = qrcode.add({ cid: req.query.cid, eid: req.query.eid });
        res.redirect('/qrcode#/e?k=' + key);
    }).catch(helper.catchError(req, res, next, false));
});

module.exports = router;
