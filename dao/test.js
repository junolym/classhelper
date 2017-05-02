var dao = require('./dao.js');

/**  login in */
dao.login("root", "4F3CC6E16818F2E5F728D5E75D93D157", function(err, doc) {
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
        dao.studentsign(1, 45, '14331024', '陈俊贤', function(err, doc){
            console.log(err);
        });
        dao.studentsign(1, 45, '14331024', '陈俊贤', function(err, doc){
            console.log(err);
        });
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

