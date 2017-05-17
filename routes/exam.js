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
        result = JSON.parse(JSON.stringify(result));
        var types = ['question_selection', 'question_judgeanswer', 'question_detail'];
        var judgeAnswers = ['answer_wrong', 'answer_right'];
        result.exam.forEach((e) => {
            e[types[e.type]] = true;
            if (e.type == 0) {
                e.answer = [];
                for (var i in e.standardAnswer) {
                    e.answer[i] = 'checked';
                }
                console.log(e);
            } else if (e.type == 1) {
                e[judgeAnswers[e.standardAnswer]] = true;
            } else {
                e.answer = e.standardAnswer;
            }
        });
        res.render('exam', result);
    }).catch((err) => {
        if (err.needLogin) {
            res.redirect('/login');
        } else {
            next(err);
        }
    });
});

module.exports = router;