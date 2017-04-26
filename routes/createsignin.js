var express = require('express');
var http = require('http');
var url = require('url');
var router = express.Router();
var dao = require('../dao/dao.js');
var cm = require('../plugins/cookie-manager.js');

router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
    	dao.addsign(1, function(err, result) {
            if (!err) {
                res.redirect('/qrcode?id='+result);
            } else {
                res.render('error', { message: 'addsign', error: err });
            }
   	    });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;