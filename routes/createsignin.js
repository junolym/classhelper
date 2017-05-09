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
        dao.checkcourse(cm.getCookie(req.cookies.id), courseId)
        .then(function() {
            addsign(res, courseId);
        }).catch(function(err) {
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
});

var addsign = function(res, courseId) {
    dao.addsign(courseId)
    .then(function(result) {
        crypto.randomBytes(4, function(ex, buf) {
            var token = buf.toString('hex');
            res.redirect('/qrcode?id='+token);
            cm.add(token, { cid: courseId, sid: result});
        });
    }).catch(function(err) {
        res.render('error', { message: 'addsign', error: err.stack });
    });
}

module.exports = router;
