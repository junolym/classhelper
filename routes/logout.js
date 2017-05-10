var express = require('express');
var router = express.Router();
var cm = require('../plugins/cookie-manager.js');

router.get('/', (req, res, next) => {
    cm.del(req.cookies && req.cookies.id);
    res.redirect('/login');
});

module.exports = router;
