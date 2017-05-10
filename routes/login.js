var express = require('express');
var router = express.Router();
var dao = require('./../dao/dao.js');
var cm = require('../plugins/cookie-manager.js');
var crypto = require('crypto');

router.get('/', (req, res, next) => {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.redirect('/');
    } else {
        res.render('login', { title: 'Login - Classhelper' });
    }
});

router.post('/', (req, res) => {
    dao.login(req.body.form_username, req.body.form_password)
    .then(() => {
        crypto.randomBytes(16, (ex, buf) => {
            var token = buf.toString('hex');
            res.cookie('id', token);
            res.redirect('/');
            cm.add(token, req.body.form_username);
        });
    }).catch((err) => {
        if (err.userError) {
            res.render('login', { error : err.message });
        } else {
            res.render('error', { error : err });
        }
    })
});

module.exports = router;
