var express = require('express');
var router = express.Router();
var qrcode = require('../plugins/qrcode-manager.js');
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');
var examManager = require('../plugins/exam-manager.js');

router.get('/', (req, res, next) => {
    if (req.query.k) {
        res.cookie('exam', req.query.k);
        return res.redirect('/exam');
    }
    if (!req.cookies || !qrcode.get(req.cookies.exam)) {
        return res.redirect('/result?msg=请求试卷失败&err=请正确扫描二维码');
    }
    var eid = qrcode.get(req.cookies.exam).eid;
    examManager.getExam(eid).then((result) => {
        res.render('exam', { title: "答题页面", examname: result.examname, exam: result.exam });
    }).catch(helper.catchError(req, res, next, false, (err) => {
        res.redirect('/result?msg=请求试卷失败&err=' + err.message);
    }));
});

router.post('/', (req, res, next) => {
    if (!req.cookies || !qrcode.get(req.cookies.exam)) {
        return res.redirect('/result?msg=交卷失败&err=请正确扫描二维码');
    }
    var eid = qrcode.get(req.cookies.exam).eid;
    examManager.addStuAnswer(eid, req.body).then(() => {
        res.clearCookie('exam');
        res.redirect('/result?msg=交卷成功');
    }).catch(helper.catchError(req, res, next, false, (err) => {
        res.redirect('/result?msg=请求试卷失败&err=' + err.message);
    }));
});

router.get('/preview', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((result) => {
        res.render('exam', { preview: true, title: "预览试卷", examname: result.examname, exam: result.exam });
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
        res.render('exam', { preview: true, title: "答案", examname: result.examname, exam: result.examWithAnswer } );
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