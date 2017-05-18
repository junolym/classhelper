var express = require('express');
var router = express.Router();
var qrcode = require('../plugins/qrcode-manager.js');
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');
var examManager = require('../plugins/exam-manager.js');

router.get('/', (req, res, next) => {
    if (req.query.k) {
        res.cookie('exam', req.query.k);
        res.redirect('/exam');
    } else {
        if (!req.cookies || !qrcode.get(req.cookies.exam))
            return res.redirect('/result?msg=请求试卷失败&err=请正确扫描二维码');
        var eid = qrcode.get(req.cookies.exam).eid;
        examManager.getExam(eid).then((result) => {
            res.render('exam', result);
        }).catch((err) => {
            if (err.userError) {
                res.redirect('/result?msg=测试失败&err=' + err.message);
            } else {
                next(err);
            }
        });
    }
});

router.post('/', (req, res, next) => {
    res.send(JSON.stringify(req.body));
});

router.get('/preview', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((result) => {
        res.render('exam', result);
    }).catch((err) => {
        if (err.needLogin) {
            res.redirect('/login');
        } else {
            next(err);
        }
    });
});

router.get('/showanswer', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkexam(user, req.query.cid, req.query.eid);
    }).then(() => {
        return examManager.getExam(req.query.eid);
    }).then((result) => {
        res.render('exam', { examname: result.examname, exam: result.examWithAnswer } );
    }).catch((err) => {
        if (err.needLogin) {
            res.redirect('/login');
        } else {
            next(err);
        }
    });
});

module.exports = router;