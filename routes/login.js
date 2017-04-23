var express = require('express');
var router = express.Router();
var dao = require('./../models/DAO.js');
var cm = require('../plugins/cookie-manager.js');
var User = require('./../models/User.js');

router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.redirect('/');
    } else {
        res.render('login', { title: 'Login - Classhelper' });
    }
});

router.post('/', function(req, res) {
    dao.getuserbyname(req.body.form_username, function(err, doc) {
        if(err) {
            res.render('error', err);
        } else if(!doc) {
            res.render('login', { error : '用户不存在' });
        } else if(doc && doc.password != req.body.form_password) {
            res.render('login', { error : '密码错误' });
        } else {
            require('crypto').randomBytes(16, function(ex, buf) {
                var token = buf.toString('hex');
                console.log(token);
                res.cookie('id', token);
                res.redirect('/');
                cm.add(token, req.body.form_username);
            });
        }
    });
});

module.exports = router;
