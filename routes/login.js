var express = require('express');
var router = express.Router();
var dao = require('./../models/DAO.js');
var cm = require('../plugins/cookie-manager.js');
var User = require('./../models/User.js');

var mongoose = require('mongoose');

var db = mongoose.connect('127.0.0.1/test');

db.connection.on("error", function (error) {
 console.log("Connect error:" + error);
});

db.connection.on("open", function () {
 console.log("Connect success");
});

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login - Classhelper' });
});

router.post('/', function(req, res) {
    response = {
        name:req.body.form_username,
        password:req.body.form_password
    };
    console.log(response);

    dao.getuserbyname(req.body.form_username, function(err, doc) {
        if(err)
            res.send(err);
        else if(!doc) {
            res.send("用户不存在!");
        }
        else if(doc && doc.password != req.body.form_password) {
            res.send("密码错误！");
        }
        else {
             console.log("登陆成功！！");

             //set cookie
             require('crypto').randomBytes(16, function(ex, buf) {
                var token = buf.toString('hex');
                console.log(token);
                res.cookie('id', token);
                res.redirect('/');
                cm.add(token, req.body.form_username);
                //response.end(token);
            });

             console.log("Cookie has been set!");

        }
    });

});

module.exports = router;
