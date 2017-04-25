var dao = require('./dao.js');
var student = require('./student.js');


dao.login("root", "4F3CC6E16818F2E5F728D5E75D93D157", function(err, doc) {
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
    testadd();
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
            for (var i in coz_stu) {
                arr.push([doc, coz_stu[i][0], coz_stu[i][1]]);
            }
            dao.addstutocourse(arr, function(err, doc){
                console.log(err);
                console.log(doc);
            });
        })
    });
}

