var dao = require('./dao.js');
var student = require('./student.js');

var user = {
    "account" : "stsluy",
    "password" : "luyong",
    "admin" : 0,
    "username" : "陆勇",
    "email" : "stsluy@mail.sysu.edu.cn"
};

var course = {
    "coz_account": "stsluy",
    "course_name" : "综合实训-(全国大学生计算机设计大赛)",
};

var course_student = [
    14331182,
    14331237,
    14331370, 
    14331147, 
    14331024, 
    14331040,
    14331279, 
    14331139, 
    14331245, 
    14331319, 
    14331111,
    14331377, 
    14331386, 
    14331082, 
    14331110, 
    14331244, 
    14331277
];

dao.login("root", "root", function(err, doc) {
    // dao.getcoursebyaccount('wenxr12', function(err, doc){
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.delcourse(1, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.addstudent(student, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // })
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
            var arr = [];
            for (var i in course_student) {
                arr.push([doc, course_student[i]]);
            }
            dao.addstutocourse(arr, function(err, doc){
                console.log(err);
                console.log(doc);
            });
        })
    });
}

