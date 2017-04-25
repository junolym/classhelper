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
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "select * from users where account=?"
            connect.query(sql, account, function(err, result, fields) {
                connect.release();
                if (!err && result.length == 0) {
                    err = 1;
                }
                callback(err, result);
            });
        }
    });
};

exports.adduser = function(admin, newuser, callback) {
    // 权限
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "select admin from users where account=?";
            connect.query(sql, admin, function(err, result, fields) {
                if (err) {
                    callback(err, result)
                } else if (result.length == 0) {
                    callback(1, result);
                    connect.release();
                } else if (result[0].admin == 0) {
                    callback(2, result);
                    connect.release();
                } else {
                    sql = "insert into users set ?";
                    connect.query(sql, newuser, 
                                    function(err, result, fields) {
                        connect.release();
                        if (err)
                            callback(err, result)
                        else
                            callback(err, result.insertId);
                    });
                }
            });
        }
    });
};

exports.deluser = function(account, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "delete from users where account=?";
            connect.query(sql, account, function(err, result, fields) {
                connect.release();
                if (err)
                    callback(err, result);
                else
                    callback(err, result.affectedRows);
            });
        }
    });
};

exports.getcoursebyaccount = function(account, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "select course_id, course_name from courses"
                    + " where coz_account=?";
            connect.query(sql, account, function(err, result, fields) {
                connect.release();
                callback(err, result);
            });
        }
    });
};

exports.addcourse = function(course, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "insert into courses set ?";
            connect.query(sql, course, function(err, result, fields) {
                connect.release();
                if (err)
                    callback(err, result);
                else
                    callback(err, result.insertId);
            });
        
        }
    });
};

exports.delcourse = function(course_id, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "delete from courses where course_id=?";
            connect.query(sql, course_id, function(err, result, fields) {
                connect.release();
                if (err)
                    callback(err, result)
                else
                    callback(err, result.affectedRows);
            });
        
        }
    });
};

exports.getexambycourse = function(course_id, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "select * from exams where ex_course_id= ?";
            connect.query(sql, course_id, function(err, result, fields) {
                connect.release();
                callback(err, result);
            });
        }
    });
};

exports.addexam = function(exam, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "insert into exams set ?";
            connect.query(sql, exams, function(err, result, fields) {
                connect.release();
                if (err)
                    callback(err, result)
                else 
                    callback(err, result.insertId);
            });
        
        }
    });
};

exports.delexam = function(course_id, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "delete from exams where exam_id=?";
            connect.query(sql, exam_id, function(err, result, fields) {
                connect.release();
                if (err)
                    callback(err, result);
                else
                    callback(err, result.affectedRows);
            });
        
        }
    });
};

exports.addsign = function(course_id, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "insert into signup set ss_course_id=?";
            connect.query(sql, course_id, function(err, result, fields) {
                connect.release();
                if (err)
                    callback(err, result)
                else
                    callback(err, result.insertId);
            });
        
        }
    });
};

exports.studentsign = function(sign_id, student_id) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "insert into stu_sign set ss_sign_id=?,"
                    + "ss_student_id=?";
            connect.query(sql, sign_id, student_id, 
                            function(err, result, fields) {
                connect.release();
                callback(err, result);
            });
        }
    });
};

exports.addstutocourse = function(course_student, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "insert into coz_stu(cs_course_id, cs_student_id)" 
                    + " values ?";
            connect.query(sql, [course_student], 
                            function(err, result, fields) {
                connect.release();
                callback(err, result);
            });
        }
    });
};

exports.addstudent = function(student, callback) {
    pool.getConnection(function(err, connect) {
        if (err) {
            callback(err);
        } else {
            var sql = "insert into students(student_id, student_name) "
                    + "values ?";
            connect.query(sql, [student], function(err, result, fields) {
                connect.release();
                callback(err, result);
            });
        }
    });
};
