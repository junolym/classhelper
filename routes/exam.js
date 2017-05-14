var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.send('get exam');
});

router.post('/', (req, res, next) => {
    res.send(JSON.stringify(req.body));
});

module.exports = router;