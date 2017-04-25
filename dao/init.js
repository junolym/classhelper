var dao = require('./dao.js');
var data = require('./data.js');

dao.login("root", "4F3CC6E16818F2E5F728D5E75D93D157", function(err, doc) {
    dao.adduser("root", data.user, function(err, doc) {
        dao.addstudent(data.student, function(err, doc) {
            dao.addcourse(data.course, function(err, doc) {
                var arr = [];
                for (var i in data.coz_stu) {
                    arr.push([doc, data.coz_stu[i][0], data.coz_stu[i][1]]);
                }
                dao.addstutocourse(arr, function(err, doc) {
                    if (!err) console.log('OK!');
                });
            })
        });
    });
});

