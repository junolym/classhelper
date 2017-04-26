var express = require('express');
var router = express.Router();
var url = require('url');

router.get('/', function(req, res, next) {
    var params = url.parse(req.url, true).query;
    if (params.success) {
    	res.render('signinresult', { title : '签到成功' });
    } else {
    	res.render('signinresult', { title : '签到失败', error : '签到失败<br>' + params.error });
    }
});


module.exports = router;