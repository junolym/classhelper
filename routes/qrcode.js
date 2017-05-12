var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render('qrcode', { title: '签到二维码' });
});

module.exports = router;