var express = require('express');
var router = express.Router();
var dao = require('../dao/dao.js');
var userManager = require('../controllers/user-manager.js');

/**
 * 本文件包含以下url的路由: /, /login, /logout
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

router.post('/login', (req, res, next) => {
    dao.login(req.body.form_username, req.body.form_password)
    .then((result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        req.session.user = result.account;
        req.session.username = result.username;
        req.session.email = result.email;
        req.session.phone = result.phone;
        res.redirect(req.query.next || '/');
    }).catch((err) => {
        if (err.userError) {
            res.render('login', { error : err.message });
        } else {
            res.render('error', { error : err });
        }
    })
});

router.post('/register', (req, res, next) => {
    userManager.register(req.body.form_username+"",
        req.body.form_password+"",
        req.body.form_email+"")
    .then((message) => {
        return res.redirect('/result?msg=' + message);
    }).catch(next);
});

router.post('/resetpassword', (req, res, next) => {
    userManager.resetpassword(req.body.form_username+"",
        req.body.form_email+"")
    .then((message) => {
        return res.redirect('/result?msg=' + message);
    }).catch(next);
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
