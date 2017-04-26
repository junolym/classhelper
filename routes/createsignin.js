var express = require('express');
var http = require('http');
var url = require('url');
var router = express.Router();
var dao = require('./../dao/dao.js');
var cm = require('../plugins/cookie-manager.js');

router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
    	dao.addsign(1, function(error, result){
        if (error) {
            console.log(error);
        }
        else {
            var id = result;
            res.redirect('/qrcode?id='+id);
        }
   	  });
    	//var params = url.params(req.url, true).query;

        
    } else {
       // res.render('login', { title: 'Login - Classhelper' });
    }
});

module.exports = router;