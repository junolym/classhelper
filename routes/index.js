var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.user) {
        res.render('index', { title: 'Classhelper', user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
