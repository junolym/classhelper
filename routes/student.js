var express = require('express');
var router = express.Router();
var qrcode = require('../plugins/qrcode-manager.js');
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');
var examManager = require('../plugins/exam-manager.js');

// student get paper
// use short url to reduce complexity of qrcode
router.get('/e', (req, res, next) => {
    if (req.query.k) {
        res.cookie('exam', req.query.k);
        return res.redirect('/e');
    }
    if (!req.cookies || !qrcode.get(req.cookies.exam)) {
        return res.redirect('/result?msg=请求试卷失败&err=请正确扫描二维码');
    }
    var eid = qrcode.get(req.cookies.exam).eid;
    examManager.getExam(eid).then((result) => {
        res.render('exam', { title: "答题页面", examname: result.examname, exam: result.questions });
    }).catch(helper.catchError(req, res, next, false, (err) => {
        res.redirect('/result?msg=请求试卷失败&err=' + err.message);
    }));
});

// student post answer
router.post('/e', (req, res, next) => {
    if (!req.cookies || !qrcode.get(req.cookies.exam)) {
        return res.redirect('/result?msg=交卷失败&err=请正确扫描二维码');
    }
    var eid = qrcode.get(req.cookies.exam).eid;
    examManager.addStuAnswer(eid, req.body).then(() => {
        res.clearCookie('exam');
        res.redirect('/result?msg=交卷成功');
    }).catch(helper.catchError(req, res, next, false, (err) => {
        res.redirect('/result?msg=交卷失败&err=' + err.message);
    }));
});

// student get signin page
// use short url to reduce complexity of qrcode
router.get('/s', (req, res, next) => {
    if (req.query.k) {
        res.cookie('signin', req.query.k);
        res.redirect('/s');
    } else {
        res.render('signin', { title : '签到' });
    }
});

// student sign in
router.post('/s', (req, res) => {
    if (!req.cookies || !qrcode.get(req.cookies.signin)) {
        return res.redirect('/result?msg=签到失败&err=请正确扫描二维码');
    }
    var sign = qrcode.get(req.cookies.signin);
    dao.studentsign(sign.cid, sign.sid, req.body.form_number, req.body.form_username)
    .then((result) => {
        res.clearCookie('signin');
        res.redirect('/result?msg=签到成功');
    }).catch((err) => {
        if (err.userError) {
            res.redirect('/result?msg=签到失败&err=' + err.message);
        } else {
            next(err);
        }
    });
});

router.get('/qrcode', (req, res, next) => {
    res.render('qrcode', { title: '二维码' });
});

router.get('/result', (req, res, next) => {
    res.render('result', { msg : req.query.msg, err : req.query.err });
});

module.exports = router;
