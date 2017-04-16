var mongoose = require('mongoose');
var User = require('./User.js');
var Course = require('./Course.js');
var Exam = require('./Exam.js');

var db = mongoose.connect('127.0.0.1/test');

db.connection.on("error", function (error) {
 console.log("Connect error:" + error);
});

db.connection.on("open", function () {
 console.log("Connect success");
});


User.findOne({user: user}).exec(function(err, doc) {
    if (!err && doc && doc.password == passwd) {
    }
});

mongoose.disconnect();
