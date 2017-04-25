var mysql = require('mysql');
var pool  = mysql.createPool({
    host: 'tx.wenxr.com',
    user: 'root',
    password: 'sysusdcs',
    database: 'test'
});

exports.login = function(account, password, callback) {
    this.getuser(account, function(err, result) {
        if (!err && result[0].password != password) {
            err = 2;
        }
        callback(err, result);
    });
};

exports.getuser = function getuser(account, callback) {
    var sql = "select * from users where account=?"
    pool.query(sql, account, function(err, result, fields) {
        if (!err && result.length == 0) {
            err = 1;
        }
        callback(err, result);
    });
};

exports.adduser = function(admin, newuser, callback) {
    // 权限
    var sql = "select admin from users where account=?";
    pool.query(sql, admin, function(err, result, fields) {
        if (err) {
            callback(err, result)
        } else if (result.length == 0) {
            callback(1, result);
        } else if (result[0].admin == 0) {
            callback(2, result);
        } else {
            sql = "insert into users set ?";
            pool.query(sql, newuser,  function(err, result, fields) {
                if (err)
                    callback(err, result)
                else
                    callback(err, result.insertId);
            });
        }
    });
};

exports.deluser = function(account, callback) {
    var sql = "delete from users where account=?";
    pool.query(sql, account, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.affectedRows);
    });
};

exports.getcoursebyaccount = function(account, callback) {
    var sql = "select course_id, course_name from courses "
            + "where coz_account=?";
    pool.query(sql, account, function(err, result, fields) {
        callback(err, result);
    });
};

exports.addcourse = function(course, callback) {
    var sql = "insert into courses set ?";
    pool.query(sql, course, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.insertId);
    });
};

exports.delcourse = function(course_id, callback) {
    var sql = "delete from courses where course_id=?";
    pool.query(sql, course_id, function(err, result, fields) {
        if (err)
            callback(err, result)
        else
            callback(err, result.affectedRows);
    });
};

exports.getexambycourse = function(course_id, callback) {
    var sql = "select * from exams where ex_course_id= ?";
    pool.query(sql, course_id, function(err, result, fields) {
        callback(err, result);
    });
};

exports.addexam = function(exam, callback) {
    var sql = "insert into exams set ?";
    pool.query(sql, exams, function(err, result, fields) {
        if (err)
            callback(err, result)
        else 
            callback(err, result.insertId);
    });
};

exports.delexam = function(exam_id, callback) {
    var sql = "delete from exams where exam_id=?";
    pool.query(sql, exam_id, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.affectedRows);
    });
};

exports.addsign = function(course_id, callback) {
    var sql = "insert into signup set ss_course_id=?";
    pool.query(sql, course_id, function(err, result, fields) {
        if (err)
            callback(err, result)
        else
            callback(err, result.insertId);
    });
};

exports.studentsign = function(sign_id, student, callback) {
    // 检查学号、姓名、课程相符
    var sql = "select cs_student_name from coz_stu where cs_student_id=?";
    pool.query(sql, student.id, student.name, 
                function(err, result, fields) {
        if (err) {
            callback(err);
        } else if (result.length == 0) {
            callback(1, A)
        } else if (result[0].cs_student_name != student.name) {
            callback(2, A)
        } else {
            var sql = "insert into student_sign set ss_sign_id=?,"
                    + "ss_student_id=?";
            pool.query(sql, sign_id, student_id, 
                            function(err, result, fields) {
                callback(err, result);
            });
        }
    });
};

exports.addstutocourse = function(coz_stu, callback) {
    var sql = "insert into coz_stu(cs_course_id, cs_student_id, "
            + "cs_student_name) values ?";
    pool.query(sql, [coz_stu], function(err, result, fields) {
        callback(err, result);
    });
};

exports.addstudent = function(student, callback) {
    var sql = "insert into students(student_id, student_name) values ?";
    pool.query(sql, [student], function(err, result, fields) {
        callback(err, result);
    });
};
