var express = require('express');
var router = express.Router();
var dao = require('./../dao/dao.js');
var crypto = require('crypto');

router.get('/', (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('login', { title: 'Login - Classhelper' });
    }
});

router.post('/', (req, res) => {
    dao.login(req.body.form_username, req.body.form_password)
    .then(() => {
        req.session.user = req.body.form_username;
        // TODO
        // get user's nick name, email, phone and store it
        res.redirect('/');
    }).catch((err) => {
        if (err.userError) {
            res.render('login', { error : err.message });
        } else {
            res.render('error', { error : err });
        }
    })
});

module.exports = router;
