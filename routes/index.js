var express = require('express');
var cm = require('../plugins/cookie-manager.js');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.render('index', { title: 'Classhelper', user: cm.getCookie(req.cookies.id) });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
