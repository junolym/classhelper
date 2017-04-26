var express = require('express');
var http = require('http');
var url = require('url');
var router = express.Router();
var dao = require('../dao/dao.js');
var cm = require('../plugins/cookie-manager.js');
var crypto = require('crypto');

router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        courseId = params.course;
        // TODO
        // 检查courseId合法，并且属于这个老师
    	dao.addsign(courseId, function(err, result) {
            if (!err) {
                crypto.randomBytes(4, function(ex, buf) {
                    var token = buf.toString('hex');
                    res.redirect('/qrcode?id='+token);
                    cm.add(token, { cid: courseId, sid: result });
                });
            } else {
                res.render('error', { message: 'addsign', error: err });
            }
   	    });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;