var express = require('express');
var router = express.Router();
var qrcode = require('../plugins/qrcode-manager.js');
var dao = require('../dao/dao.js');

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
        res.redirect('/signinresult?error='+'无效的签到');
        return;
    }
    var sign = qrcode.get(req.cookies.signin);
    dao.studentsign(sign.cid, sign.sid, req.body.form_number, req.body.form_username)
    .then((result) => {
        res.clearCookie('signin');
        res.redirect('/signinresult?success=true');
    }).catch((err) => {
        if (err.userError) {
            res.redirect('/signinresult?error=' + err.message);
        } else {
            res.render('error', { error: err });
        }
    });
});

module.exports = router;
