var express = require('express');
var url = require('url');
var router = express.Router();
var dao = require('../dao/dao.js');
var cm = require('../plugins/cookie-manager.js');
var crypto = require('crypto');

router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        courseId = params.course;
        dao.checksign(cm.getCookie(req.cookies.id), params.cid, params.sid)
        .then(function(result) {
            crypto.randomBytes(4, function(ex, buf) {
                var token = buf.toString('hex');
                res.redirect('/qrcode?id='+token);
                cm.add(token, { cid: params.cid, sid: params.sid });
            });
        }).catch(function(err) {
            res.render('error', { error : err });
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
