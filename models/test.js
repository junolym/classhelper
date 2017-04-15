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

var me = new User ({
    "user" : "wenxr11",
    "password" : "2333",
    "mode" : 0,
    "name" : "wenxr",
});

me.save(function(err, t) {
    if (err) console.log(err);
    console.log(t);
});

User.find(function(err, t) {
    if (err) console.log(err);
    console.log(t);
});

var c = new Course({
    "name" : "op2",
    "student" : [{
        "stu_id" : "14331279",
        "name" : "wenxr",
    }, {
        "stu_id" : "14331277",
        "name" : "wenxr3",
    }],
    "time" : "1-15周星期三4-7节",
    "check" : {
        date: new Date,
        student: ["wenxr3", "wenxr2"]
    }
});

c.save(function(err, t) {
    if (err) console.log(err);
});

Course.find(function(err, t) {
    if (err) console.log(err);
    console.log(t);
});

// Exam
var e = new Exam({
    name: "final",
    state: 2,
    time: new Date
});

e.save(function(err, t) {
    if (err) console.log(err);
});


mongoose.disconnect();







