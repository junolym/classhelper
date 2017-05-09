var dao = require('./dao.js');
var data = require('./data.js');

dao.adduser("root", "stsluy", "7E852574927312FFDBC74408F2C92671",
    "陆勇", "stsluy@mail.sysu.edu.cn", null)
.then(function(doc) {
    return dao.addcourse('stsluy', '综合实训-(全国大学生计算机设计大赛)', 
                            '周六、日 1-15', null);
}).then(function(doc) {
    return dao.addstutocourse(doc, data.coz_stu);
}).then(function(doc) {
    var p1 = dao.addcourse('stsluy', '程序设计II', '1-18 周一1-2',null);
    var p2 = dao.addcourse('stsluy', '程序设计II实验', '1-18 周一7-8',null);
    var p3 = dao.addcourse('stsluy', '程序设计II', '1-18 周一4-5',null);
    var p4 = dao.addcourse('stsluy', '程序设计II实验', '1-18 周一4-5',null);
    return Promise.all([p1, p2, p3, p4]);
}).then(function(doc) {
    console.log('OK');
}).catch(function(err) {
    console.log(err);
});


