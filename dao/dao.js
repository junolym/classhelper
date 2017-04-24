var mysql = require('mysql');
var connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});
connect.connect();

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
    connect.query(sql, account, function(err, result, fields) {
        if (!err && result.length == 0) {
            err = 1;
        }
        callback(err, result);
    });
} 

exports.adduser = function(admin, newuser, callback) {
    // 权限
    var sql = "select admin from users where account=?";
    connect.query(sql, admin, function(err, result, fields) {
        if (err) {
            callback(err, result)
        } else if (result.length == 0) {
            callback(1, result);
        } else if (result[0].admin == 0) {
            callback(2, result);
        } else {
            sql = "insert into users set ?";
            connect.query(sql, newuser, function(err, result, fields) {
                if (err)
                    callback(err, result)
                else
                    callback(err, result.insertId);
            });
        }
    });
}

exports.deluser = function(account, callback) {
    var sql = "delete from users where account=?";
    connect.query(sql, account, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.affectedRows);
    });
}

exports.getcoursebyaccount = function(account, callback) {
    var sql = "select course_id, course_name from courses where account=?";
    connect.query(sql, account, function(err, result, fields) {
        callback(err, result);
    });
}

exports.addcourse = function(course, callback) {
    var sql = "insert into courses set ?";
    connect.query(sql, course, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.insertId);
    });
}

exports.delcourse = function(course_id, callback) {
    var sql = "delete from courses where course_id=?";
    connect.query(sql, course_id, function(err, result, fields) {
        if (err)
            callback(err, result)
        else
            callback(err, result.affectedRows);
    });
}

exports.getexambycourse = function(course_id, callback) {
    var sql = "select exam_id, exam_name, exam_state, exam_time"
            + "from exams where =?";
    connect.query(sql, course_id, function(err, result, fields) {
        callback(err, result);
    });
}

exports.addexam = function(exam, callback) {
    var sql = "insert into exams set ?";
    connect.query(sql, exams, function(err, result, fields) {
        if (err)
            callback(err, result)
        else 
            callback(err, result.insertId);
    });
}

exports.delexam = function(course_id, callback) {
    var sql = "delete from exams where exam_id=?";
    connect.query(sql, exam_id, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.affectedRows);
    });
}

exports.addsign = function(course_id, callback) {
    var sql = "insert into sign_up_sheet set course_id=?";
    connect.query(sql, course_id, function(err, result, fields) {
        if (err)
            callback(err, result)
        else
            callback(err, result.insertId);
    });
}

exports.studentsign = function(sign_id, student_id) {
    var sql = "insert into student_sign set sign_id=?, student_id=?";
    connect.query(sql, sign_id, student_id, function(err, result, fields) {
        callback(err, result);
    });
}

exports.addstutocourse = function(student, callback) {
    var sql = "insert into students set ?";
    connect.query(sql, student, function(err, result, fields) {
        var sql = "insert into students set ?";
        
    
    });

}
