var express = require('express');
var router = express.Router();
var dao = require('./../dao/dao.js');
var cm = require('../plugins/cookie-manager.js');
var crypto = require('crypto');

router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.redirect('/');
    } else {
        res.render('login', { title: 'Login - Classhelper' });
    }
});

router.post('/', function(req, res) {
    dao.login(req.body.form_username, req.body.form_password)
    .then(function(doc) {
        crypto.randomBytes(16, function(ex, buf) {
            var token = buf.toString('hex');
            res.cookie('id', token);
            res.redirect('/');
            cm.add(token, req.body.form_username);
        });
    }).catch(function(err) {
        res.render('login', { error : err.stack });
    })
});

module.exports = router;
