var express = require('express');
var router = express.Router();
var dao = require('../dao/dao.js');

/**
 * 本文件包含以下url的路由: /, /login, /logout, /qrcode, /result
 * */

router.get('/', (req, res, next) => {
    if (req.session.user) {
        res.render('index', { title: 'Classhelper', user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res, next) => {
    if (req.session.user) {
        res.redirect(req.query.next || '/');
    } else {
        res.render('login', { title: 'Login - Classhelper' });
    }
});

router.post('/login', (req, res) => {
    dao.login(req.body.form_username, req.body.form_password)
    .then(() => {
        req.session.user = req.body.form_username;
        // TODO
        // get user's nick name, email, phone and store it
        res.redirect(req.query.next || '/');
    }).catch((err) => {
        if (err.userError) {
            res.render('login', { error : err.message });
        } else {
            res.render('error', { error : err });
        }
    })
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/qrcode', (req, res, next) => {
    res.render('qrcode', { title: '二维码' });
});

router.get('/result', (req, res, next) => {
    res.render('result', { msg : req.query.msg, err : req.query.err });
});

module.exports = router;
