var express = require('express');
var router = express.Router();
var dao = require('./../dao/dao.js');
var cm = require('../plugins/cookie-manager.js');

router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.redirect('/');
    } else {
        res.render('login', { title: 'Login - Classhelper' });
    }
});

router.post('/', function(req, res) {
    dao.login(req.body.form_username, req.body.form_password, function(err, doc) {
        if (!err) {
            require('crypto').randomBytes(16, function(ex, buf) {
                var token = buf.toString('hex');
                console.log(token);
                res.cookie('id', token);
                res.redirect('/');
                cm.add(token, req.body.form_username);
            });
        } else if(err == 2) {
            res.render('login', { error : '密码错误' });
        } else {
            res.render('login', { error : '用户不存在' });
        }
    });
});

module.exports = router;
