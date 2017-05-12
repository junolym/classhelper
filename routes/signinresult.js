var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.query.success) {
    	res.render('signinresult', { title : '签到成功' });
    } else {
    	res.render('signinresult', { title : '签到失败', error : '签到失败<br>' + req.query.error });
    }
});


module.exports = router;