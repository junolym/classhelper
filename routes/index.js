var express = require('express');
var router = express.Router();
var dao = require('../dao/dao.js');
var userManager = require('../controllers/user-manager.js');
var helper = require('../controllers/route-helper.js');

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
    helper.checkArgs({
        '用户名': req.body.form_username,
        '密码': req.body.form_password
    }).then(() => {
        return dao.login(req.body.form_username, req.body.form_password);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        req.session.user = result.account;
        req.session.username = result.username;
        req.session.email = result.email;
        req.session.phone = result.phone;
        res.redirect(req.query.next || '/');
    }).catch(helper.catchError(req, res, next, false, err => {
        res.render('login', { error : err.message });
    }));
});

router.post('/register', (req, res, next) => {
    helper.checkArgs({
        '用户名': req.body.form_username,
        '密码': req.body.form_password,
        '邮箱': req.body.form_email
    }).then(() => {
        return userManager.register(req.body.form_username,
            req.body.form_password, req.body.form_email)
    }).then((message) => {
        return res.redirect('/result?msg=' + message);
    }).catch(helper.catchError(req, res, next, false, err => {
        res.render('login', {
            error : err.message,
            register : true
        });
    }));
});

router.post('/resetpassword', (req, res, next) => {
    helper.checkArgs({
        '用户名': req.body.form_username,
        '邮箱': req.body.form_email
    }).then(() => {
        return userManager.resetpassword(req.body.form_username,
            req.body.form_email);
    }).then((message) => {
        return res.redirect('/result?msg=' + message);
    }).catch(helper.catchError(req, res, next, false, err => {
        res.render('login', {
            error : err.message,
            forget : true
        });
    }));
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
