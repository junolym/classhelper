var dao = require('./dao.js');
var student = require('./student.js');

var user = {
    "account" : "wenxr11",
    "password" : "2333",
    "admin" : 0,
    "username" : "wenxr"
};

var course = {
    "account": "wenxr11",
    "course_name" : "op2",
    "course_time" : "1-15"
};

dao.login("root", "root", function(err, doc) {
    // dao.getcoursebyaccount('wenxr12', function(err, doc){
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.delcourse(1, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    dao.addstudent(student, function(err, doc) {
        console.log(err);
        console.log(doc);
    })
    // testadd();
    // dao.getuser('wenxr11', function(err, doc) {
    //     console.log(err)
    //     console.log(doc[0].password);
    // })
    // dao.deluser('wenxr11', function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // })
});

var testadd = function() {
    dao.adduser("root", user, function(err, doc) {
        dao.addcourse(course, function(err, doc) {
            dao.addsign(doc, function(err, doc) {
            });
        })
    });
}

