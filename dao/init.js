var dao = require('./dao.js');
var data = require('./data.js');

dao.login("root", "4F3CC6E16818F2E5F728D5E75D93D157", function(err, doc) {
    dao.adduser("root", "stsluy", "7E852574927312FFDBC74408F2C92671",
        "陆勇", "stsluy@mail.sysu.edu.cn", null, function(err, doc) {
        dao.addstudent(data.student, function(err, doc) {
            dao.addcourse('stsluy', '综合实训-(全国大学生计算机设计大赛)', 
                '周六、日 1-15', null, function(err, doc) {
                dao.addstutocourse(doc, data.coz_stu, function(err, doc) {
                });
            });
        });
        dao.addstudent(data.student_2, function(err, doc) {
        });
        dao.addcourse('stsluy', '程序设计II', '1-18	周一1-2',
            null, function(err, doc) {});
        dao.addcourse('stsluy', '程序设计II实验', '1-18	周一7-8',
            null, function(err, doc) {});
        dao.addcourse('stsluy', '程序设计II', '1-18	周一4-5',
            null, function(err, doc) {});
        dao.addcourse('stsluy', '程序设计II实验', '1-18	周一4-5',
            null, function(err, doc) {});
    });
});

