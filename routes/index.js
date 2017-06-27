var express = require('express');
var router = express.Router();
var dao = require('../dao/dao.js');
var userManager = require('../controllers/user-manager.js');
var helper = require('../controllers/route-helper.js');
var keyManager = require('../controllers/key-manager.js');

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
        req.session.destroy();
    }
    res.render('login', {
        title: 'Login - Classhelper',
        error: req.query.error,
        success: req.query.success,
        info: req.query.info
    });
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
        res.redirect('/login?error=' + err.message);
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
        res.redirect('/login?info=' + message);
    }).catch(helper.catchError(req, res, next, false, err => {
        res.redirect('/register?error=' + err.message);
    }));
});

router.get('/register', (req, res, next) => {
    var account = keyManager.get(req.query.code);
    if (!account || !account.register) {
        return res.render('login', {
            error : req.query.code ? '验证链接已过期，请重新注册'
                : req.query.error,
            register : true
        });
    }
    dao.checkemail(account.email).then((res) => {
        return dao.adduser(account.username, account.password,
            account.username, account.email, '');
    }).then(() => {
        keyManager.del(req.query.code);
        res.redirect('/login?success=' + '注册成功');
    }).catch(helper.catchError(req, res, next, false, err => {
        res.redirect('/register?error=' + err.message)
    }));
});

router.post('/resetpassword', (req, res, next) => {
    if (req.body.code) {
        var account = keyManager.get(req.body.code);
        if (!account || !account.resetpassword) {
            return res.redirect('/resetpassword?error=' + '链接已过期');
        }
        if (account.username != req.body.form_username) {
            return res.redirect('/resetpassword?error=' + '用户名不一致');
        }

        helper.checkArgs({
            '密码': req.body.form_password
        }).then(() => {
            return dao.updateuserpwd(account.username, req.body.form_password);
        }).then(() => {
            keyManager.del(req.body.code);
            res.redirect('/login?success=' + '密码重置成功，请用新密码登录');
        }).catch(helper.catchError(req, res, next, false, err => {
            res.redirect('/resetpassword?error=' + err.message);
        }));
    } else {
        helper.checkArgs({
            '用户名': req.body.form_username,
            '邮箱': req.body.form_email
        }).then(() => {
            return userManager.resetpassword(req.body.form_username,
                req.body.form_email);
        }).then((message) => {
            res.redirect('/login?info=' + message);
        }).catch(helper.catchError(req, res, next, false, err => {
            res.redirect('/resetpassword?error=' + err.message);
        }));
    }
});

router.get('/resetpassword', (req, res, next) => {
    res.render('login', {
        reset : req.query.code,
        forget : !req.query.code,
        code : req.query.code,
        error : req.query.error,
        success : req.query.success,
        info : req.query.info
    });
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
