var dao = require('./dao.js');
var data = require('./data.js');

// dao.addcourse('test', '综合实训-(全国大学生计算机设计大赛)', 
//     '周六、日 1-15', null, function(err, doc) {
//     dao.addstutocourse(doc, data.coz_stu, function(err, doc) {
//     });
// });
// dao.addcourse('test', '程序设计II', '1-18	周一1-2',
//     null, function(err, doc) {
//     dao.addstutocourse(doc, data.student_2, function(err, doc) {
//     });
// });

dao.login("root", "4F3CC6E16818F2E5F728D5E75D93D157", function(err, doc) {
    dao.updateexam(2, 'update', 'que', function(err, doc) {
        console.log(err);
        console.log(doc);
    });
    // dao.delexam(1, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.getexambyid(1, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.getexambycourse(6, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.addexam(6, 'exam', "{'num': 0}", function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.updatecourse(31, '你们够了', '1-20周 周一-周六 1-15节', 
    //     '就是这么任性，哼', function(err, doc) {
    //         console.log(err, doc);
    // });
    // dao.getcoursebyid(1, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.getstubycourse(1, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.checkcourse('stsluy1', 1, function(err) {
    //     console.log(err);
    // });
    // dao.addsign(1, function(err, signid) {
    //     console.log(signid);
        // dao.studentsign(1, 45, '14331024', '陈俊贤', function(err, doc){
        //     console.log(err);
        // });
        // dao.studentsign(1, 45, '14331024', '陈俊贤', function(err, doc){
        //     console.log(err);
        // });
        // dao.studentsign(1, signid, '14331279', '温晓锐', function(err, doc) {
        // });
        // dao.studentsign(1, signid, '14331139', '李文盛', function(err, doc) {
        // });
        // dao.studentsign(1, signid, '14331040', '陈鑫', function(err, doc) {
        // });
    // });
    // dao.checksign('stsluy', 1, 40, function(err) {
    //     console.log(err);
    // });
    // dao.getsignbyaccount('stsluy', function(err, doc)  {
    //    console.log(doc);
    // });
    // dao.getsignbycourse(1, function(err, doc) {
    //     console.log(doc);
    // });
    // dao.getsignbyid(47, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // })
    // });
    // var info = ['test', '2333', null];
    // dao.updateuserinfo('test', info, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
    // dao.updateuserpwd('test', '123', 'FDB6C662D36651211F14977097250CCA',
    //     function(err, doc) {
    //         console.log(err);
    //         console.log(doc);
    // });
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

