var dao = require('./dao.js');
var data = require('./data.js');

// dao.statsexamdetail(6, 14331024)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// // dao.statsexambycourse(6)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.statssigndetail(6, 14331024)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.statssignbycourse(6)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.delstusign(34, 14331024)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.updatestatistics("1", null)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.copyexam(13, 6)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.getanswerbystudent(13, 14331040)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });

// dao.getanswerbyexam(13)
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });

// dao.checkstudent(15332020, 29, '张增辉')
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.addanswer(1, 1, 1, 0, 'ans')
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.checkexam('test', '7', '11')
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.getexambyaccount('stsluy')
// .then(function(doc) {
//     console.log(doc);
// }).catch(function(err) {
//     console.log(err);
// });
// dao.addcourse('test2', '综合实训-(全国大学生计算机设计大赛)', 
//     '周六、日 1-15', null)
//     .then(function(doc) {
//         console.log(doc);
//     }).catch(function(err) {
//         console.log(err);
//     });

    // dao.addstutocourse(29, data.student_2)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
// dao.addcourse('test', '程序设计II', '1-18	周一1-2',
//     null, function(err, doc) {
//     dao.addstutocourse(doc, data.student_2, function(err, doc) {
//     });
// });

// dao.login("root", "4F3CC6E16818F2E5F728D5E75D93D157")
//     .then(function(doc) {
//         console.log(doc); 
//     }, function(err) {
//         console.log(err);
//     });
// dao.adduser('root', 'test2', '4F3CC6E16818F2E5F728D5E75D93D157', 't', 
//         null, null).then(function(doc) {
//             console.log(doc);
//         }).catch(function(err) {
//             console.log(err);
//         })

    // dao.updateexam(1, 'update', 'que')
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.delexam(4)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.getexambyid(1)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.getexambycourse(6)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.addexam(1, 'exam', "{'num': 0}")
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });

    // dao.updatecourse(34, '你们够了', '1-20周 周一-周六 1-15节', 
    //         '就是这么任性，哼')
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.getcoursebyid(100)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.getstubycourse(1)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    //
    // dao.checkcourse('stsluy', 300)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.addsign(1)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    //     console.log(signid);
    // dao.studentsign(1, 1, '14331024', '陈俊贤')
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
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
    // dao.checksign('stsluy', 1, 8)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.getsignbyaccount('stsluy')
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.getsignbycourse(6)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.getsignbyid(5)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });

    // var info = ['test', '2333', null];
    // dao.updateuserinfo('test2', info).then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.updateuserpwd('test1', '4F3CC6E16818F2E5F728D5E75D93D157', 'FDB6C662D36651211F14977097250CCA')
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.getcoursebyaccount('stsluy')
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.delcourse('test2', 30)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
    // dao.addstudent(student)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });

    // testadd();
    // dao.getuser('wenxr11', function(err, doc) {
    //     console.log(err)
    //     console.log(doc[0].password);
    // })
    // dao.deluser('test10')
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });

    // dao.delsign(22)
    // .then(function(doc) {
    //     console.log(doc);
    // }).catch(function(err) {
    //     console.log(err);
    // });
