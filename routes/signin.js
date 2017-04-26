var express = require('express');
var router = express.Router();
var url = require('url');
var cm = require('../plugins/cookie-manager.js');
var dao = require('./../dao/dao.js');


router.get('/', function(req, res, next) {
    if (req.cookies && cm.check(req.cookies.id)) {
        var params = url.parse(req.url, true).query;
        res.cookie('signin', params.id);
        res.render('signin', { title : 'signin' });
    } else {
        //res.render('login', { title: 'Login - Classhelper' });
    }
});

router.post('/', function(req, res) {
    var signin_id;
    dao.studentsign(1, req.cookies.signin, req.body.form_number, req.body.form_username, function(err, result){
        //console.log(req.body.form_number, req.body.form_username);
        if (err == 1) {
            console.log('id不在课程中');
            res.redirect('/signinresult?result=error&&error='+'id不在课程中');
        }
        else if (err == 2) {
        console.log('学号名字不符合');
        res.redirect('/signinresult?result=error&&error='+'学号名字不符合');
         }
        else {
        console.log(err);
        res.redirect('/signinresult?result=success');
        }
    });

    

});

module.exports = router;
