var express = require('express');
var router = express.Router();
var url = require('url');
var cm = require('../plugins/cookie-manager.js');
var dao = require('../dao/dao.js');


router.get('/', function(req, res, next) {
    var params = url.parse(req.url, true).query;
    if (params.id) {
        res.cookie('signin', params.id);
        res.redirect('/signin');
    } else {
        res.render('signin', { title : '签到' });
    }
});

router.post('/', function(req, res) {
    if (!req.cookies || !cm.check(req.cookies.signin)) {
        res.redirect('/signinresult?error='+'无效的签到');
        return;
    }
    var cookie = cm.getCookie(req.cookies.signin);
    dao.studentsign(cookie.cid, cookie.sid, req.body.form_number, req.body.form_username)
    .then(function(result) {
        res.clearCookie('signin');
        res.redirect('/signinresult?success=true');
    }).catch(function(err) {
        if (err.status == 500) {
            res.redirect('/signinresult?error='+err.stack);
        } else {
            res.render('error', { message: 'studentsign', error: err });
        }
    });
});

module.exports = router;
