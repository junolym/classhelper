var DAO = require('./DAO.js');
var User = require('./User.js');
var Course = require('./Course.js');
var Exam = require('./Exam.js');

var mongoose = require('mongoose');

var db = mongoose.connect('127.0.0.1/test');

db.connection.on("error", function (error) {
 console.log("Connect error:" + error);
});

db.connection.on("open", function () {
 console.log("Connect success");
});

        
var us = {
    "user" : "wenxr11",
    "password" : "2333",
    "mode" : 0,
    "name" : "wenxr",
}

var cos = {
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
        'date': new Date,
        'student': ["wenxr3", "wenxr2"]
    }
};

var ex = {
    'name' : 'Finall exam',
    'state': '0',
    'time' : new Date,
    'question' : [
        {
            'type' : 0,
            'head' : 'php is the best language?',
            'ans' : true
        }, {
            'type' : 1,
            'number': 4,
            'head' : 'which is the best language?',
            'A' : 'C/C++',
            'B' : 'Java',
            'C' : 'Python',
            'D' : 'PhP',
            'ans' : 'D'
        }
    ]
};

var me = new User(us);
// me.save();

// DAO.adduser(us, function(err, doc) {
//     if (!err && doc) {
//         console.log(doc);
//     } else {
//         console.log('err' + err + 'doc' + doc);
//     }
// });

DAO.getuserbyname('wenxr11', function(err, doc) {
    if (!err && doc && doc.password == '2333') {
        console.log('log in!');
        // test1(doc);
        test2(doc);
    } else {
        console.log('fail!');
    }
});

function test1(doc) {
    DAO.addcourse(cos, doc.id, function(err, course) {
        DAO.addexam(ex, course.id, function(err, exam) {
            DAO.addexam(ex, course.id, function(err, exam) {
            })
        });
    });
}

function test2(doc) {
    DAO.delcourse(doc.course[0], doc.id, function(err, doc) {
    });
}

