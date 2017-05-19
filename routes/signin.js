var express = require('express');
var router = express.Router();
var qrcode = require('../plugins/qrcode-manager.js');
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');

router.get('/create', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.addsign(req.query.cid);
    }).then((result) => {
        var key = qrcode.add({ cid: req.query.cid, sid: result });
        res.redirect('/qrcode#/s?k=' + key);
    }).catch(helper.catchError(req, res, next, false, (err) => {
        res.redirect('/result?msg=请求试卷失败&err=' + err.message);
    }));
});

router.get('/showqrcode', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid);
    }).then(() => {
        var key = qrcode.add({ cid: req.query.cid, sid: req.query.sid });
        res.redirect('/qrcode#/s?k=' + key);
    }).catch(helper.catchError(req, res, next, false));
});

router.get('/', (req, res, next) => {
    if (req.query.k) {
        res.cookie('signin', req.query.k);
        res.redirect('/signin');
    } else {
        res.render('signin', { title : '签到' });
    }
});

router.post('/', (req, res) => {
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

module.exports = router;
