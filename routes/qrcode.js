var express = require('express');
var http = require('http');
var url = require('url');
var util = require('util');
var cm = require('../plugins/cookie-manager.js');
var router = express.Router();


router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        res.render('qrcode', { title: '签到二维码' });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;