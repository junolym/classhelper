var express = require('express');
var router = express.Router();
var cm = require('../plugins/cookie-manager.js');

router.get('/', function(req, res, next) {
    if (req.cookies) {
        cm.del(req.cookies.id);
    }
    res.redirect('/login');
});

module.exports = router;
