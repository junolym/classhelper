var express = require('express');
var router = express.Router();
var url = require('url');
var cm = require('../plugins/cookie-manager.js');
var dao = require('../dao/dao.js');


router.get('/', (req, res, next) => {
    if (req.query.id) {
        res.cookie('signin', req.query.id);
        res.redirect('/signin');
    } else {
        res.render('signin', { title : '签到' });
    }
});

router.post('/', (req, res) => {
    if (!req.cookies || !cm.check(req.cookies.signin)) {
        res.redirect('/signinresult?error='+'无效的签到');
        return;
    }
    var cookie = cm.getCookie(req.cookies.signin);
    dao.studentsign(cookie.cid, cookie.sid, req.body.form_number, req.body.form_username)
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
