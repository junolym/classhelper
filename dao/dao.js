var mysql = require('mysql');
var pool  = mysql.createPool({
    host: 'tx.wenxr.com',
    user: 'root',
    password: 'sysusdcs',
    database: 'test'
});

/**
 * login
 *
 * @param {string} account
 * @param {string} password 32位大写的MD5值
 * @param {function} callback
 * err=1  用户不存在  
 * err=2  密码错误    
 * result account数据 
 * */
exports.login = function(account, password, callback) {
    this.getuser(account, function(err, result) {
        if (!err && result[0].password != password) {
            err = 2;
        }
        callback(err, result);
    });
};

/**
 * getuser
 *
 * @param {string} account
 * @param {function} callback
 * err=1  用户不存在  
 * result account数据 
 */
exports.getuser = function getuser(account, callback) {
    var sql = "select * from users where account=?"
    pool.query(sql, account, function(err, result, fields) {
        if (!err && result.length == 0) {
            err = 1;
        }
        callback(err, result);
    });
};

/**
 * adduser
 *
 * @param {string} admin 管理员账号
 * @param {string} n_account
 * @param {string} n_password
 * @param {string} n_username
 * @param {string} n_email
 * @param {string} n_phone
 * @param {function} callback
 * admin   管理账户
 * err=1   账户不存在  
 * err=2   权限不足    
 * result  新用户id
 */
exports.adduser = function(admin, n_account, n_password, n_username, 
                            n_email, n_phone, callback) {
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
            sql = "insert into users(account, password, username, email, "
                + "phone) values (?, ?, ?, ?, ?)";
            var parameter = [n_account, n_password, n_username, n_email,
                            n_phone];
            pool.query(sql, parameter,  function(err, result, fields) {
                if (err)
                    callback(err, result)
                else
                    callback(err, result.insertId);
            });
        }
    });
};

/**
 * updateuserinfo
 *
 * @param {string} account
 * @param {array} userinfo [username, email, phone]
 * @param {function} callback
 * err=1   账户不存在
 * result  修改行数
 */
exports.updateuserinfo = function(account, userinfo, callback) {
    var sql = "update users set username=?, email=?, phone=? "
            + "where account=?";
    var parameter = userinfo;
    parameter.push(account);
    pool.query(sql, parameter, function(err, result, fields) {
        if (err) {
            callback(err)
        } else if (result.length == 0) {
            callback(1, result);
        } else {
            callback(err, result.affectedRows);
        }
    });
};

/**
 * updateuserpwd
 *
 * @param {string} account
 * @param {string} oldpwd
 * @param {string} newpwd
 * @param {function} callback
 * result  修改行数
 */
exports.updateuserpwd = function(account, oldpwd, newpwd, callback) {
    var sql = "update users set password=? where account=? and password=?";
    var parameter = [newpwd, account, oldpwd];
    pool.query(sql, parameter, function(err, result, fields) {
        if (err) {
            callback(err);
        } else {
            callback(err, result.affectedRows);
        }
    });
};

/**
 * deluser
 *
 * @param {string} account
 * @param {function} callback
 * result  删除行数
 */
exports.deluser = function(account, callback) {
    var sql = "delete from users where account=?";
    pool.query(sql, account, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.affectedRows);
    });
};

/**
 * getcoursebyaccount
 *
 * @param {string} account
 * @param {function} callback
 * result  [course_id, course_name]
 * 不判断account是否存在，result可以为[]
 */
exports.getcoursebyaccount = function(account, callback) {
    var sql = "select course_id, course_name from courses "
            + "where coz_account=?";
    pool.query(sql, account, function(err, result, fields) {
        callback(err, result);
    });
};

/**
 * addcourse
 *
 * @param {string} account
 * @param {string} course_name
 * @param {string} course_time
 * @param {string} course_info
 * @param {function} callback
 * result  course_id
 */
exports.addcourse = function(account, course_name, course_time, 
                                course_info, callback) {
    var sql = "insert into courses(coz_account, course_name, course_time, "
            + "course_info) values (?, ?, ?, ?)";
    var parameter = [account, course_name, course_time, course_info];
    pool.query(sql, parameter, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.insertId);
    });
};

/**
 * delcourse
 *
 * @param {number} course_id
 * @param {function} callback
 * result  删除行数
 */
exports.delcourse = function(course_id, callback) {
    var sql = "delete from courses where course_id=?";
    pool.query(sql, course_id, function(err, result, fields) {
        if (err)
            callback(err, result)
        else
            callback(err, result.affectedRows);
    });
};

/**
 * getexambycourse
 *
 * @param {number} course_id
 * @param {function} callback
 * result course数据
 */
exports.getexambycourse = function(course_id, callback) {
    var sql = "select * from exams where ex_course_id= ?";
    pool.query(sql, course_id, function(err, result, fields) {
        callback(err, result);
    });
};

/**
 * addexam
 *
 * @param {number} course_id
 * @param {string} exam_name
 * @param {object} exam_question json格式,详见文档
 * @param {function} callback
 * result exam_id
 */
exports.addexam = function(course_id, exam_name, exam_question, callback) {
    var sql = "insert into exams(exam_name, ex_course_id, exam_question) "
            + "values (?, ?, ?)";
    var parameter = [exam_name, course_id, exam_question];
    pool.query(sql, exams, function(err, result, fields) {
        if (err)
            callback(err, result)
        else 
            callback(err, result.insertId);
    });
};

/**
 * delexam
 *
 * @param {number} exam_id
 * @param {function} callback
 * result 删除行数
 */
exports.delexam = function(exam_id, callback) {
    var sql = "delete from exams where exam_id=?";
    pool.query(sql, exam_id, function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.affectedRows);
    });
};

/**
 * addsign
 *
 * @param {number} course_id
 * @param {function} callback
 * result sign_id
 */
exports.addsign = function(course_id, callback) {
    var sql = "insert into signup set sg_coz_id=?";
    pool.query(sql, course_id, function(err, result, fields) {
        if (err)
            callback(err, result)
        else
            callback(err, result.insertId);
    });
};

/**
 * studentsign
 *
 * @param {number} course_id
 * @param {number} sign_id
 * @param {number} stu_id
 * @param {string} stu_name
 * @param {function} callback
 * err=1 stu_id不在此课程内;
 * err=2 学号名字不符;
 * result 插入行数}
 */
exports.studentsign = function(course_id, sign_id, stu_id, 
                                stu_name, callback) {
    // 检查学号、姓名、课程相符
    var sql = "select cs_stu_name from coz_stu "
            + "where cs_coz_id=? and cs_stu_id=?";
    var parameter = [course_id, stu_id];
    pool.query(sql, parameter, function(err, result, fields) {
        if (err) {
            callback(err);
        } else if (result.length == 0) {
            callback(1, result);
        } else if (result[0].cs_stu_name != stu_name) {
            callback(2, result);
        } else {
            var sql = "insert into stu_sign set ss_sign_id=?, "
                    + "ss_stu_id=? "
            var parameter = [sign_id, stu_id];
            pool.query(sql, parameter, function(err, result, fields) {
                if (err)
                    callback(err, result);
                else
                    callback(err, result.affectedRows);
            });
        }
    });
};

/**
 * addstutocourse
 *
 * @param {array} coz_stu 
 * [ [coz_id1, stu_id1, stu_name1],
 * [coz_id2, stu_id2, stu_name2] ]
 * @param {function} callback
 * result 插入行数
 */
exports.addstutocourse = function(coz_stu, callback) {
    var sql = "insert into coz_stu(cs_coz_id, cs_stu_id, "
            + "cs_stu_name) values ?";
    
    pool.query(sql, [coz_stu], function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.affectedRows);
    });
};

/**
 * addstudent
 *
 * @param {array} student 
 *
 * [ [id1, name1],
 * [id2, name2] ]
 * @param {function} callback
 * result 插入行数
 */
exports.addstudent = function(student, callback) {
    var sql = "insert into students(student_id, student_name) values ?";
    pool.query(sql, [student], function(err, result, fields) {
        if (err)
            callback(err, result);
        else
            callback(err, result.affectedRows);
    });
};

/**
 * getsigncourse
 *
 * @param {number} course_id
 * @param {function} callback
 * [{time:xx, sign_num:xx, stu_num:xx}]
 */
exports.getsignbycourse = function(course_id, callback) {
    var sql = "select sign_time as time, count(ss_sign_id) as sign_num, "
            + "student_num as stu_num from signup, stu_sign, courses "
            + "where course_id = ? and sg_coz_id = course_id " 
            + "and ss_sign_id = sign_id group by sign_id";
    pool.query(sql, course_id, function(err, result, fields) {
        callback(err, result);
    });
}

/**
 * getsignbyid
 *
 * @param {number} sign_id
 * @param {function} callback
 * [{id:xxx, name:xxx, time:xxx}]
 */
exports.getsignbyid = function(sign_id, callback) {
    var sql = "select ss_stu_id as id, cs_stu_name as name, "
            + "stu_sign_time as time from coz_stu, stu_sign, signup " 
            + "where sign_id=? and sign_id=ss_sign_id and " 
            + "sg_coz_id=cs_coz_id and cs_stu_id=ss_stu_id"
    pool.query(sql, sign_id, function(err, result, fields) {
        callback(err, result);
    })
}

/**
 * getsignbyaccount
 *
 * @param {number} course_id
 * @param {function} callback
 * [{name:xxx, time:xxx, sign_num:xxx, stu_num:xxx}]
 */
exports.getsignbyaccount = function(course_id, callback) {
    var sql = "select course_name as name, sign_time as time, "
            + "count(ss_sign_id) as sign_num, student_num as stu_num " 
            + "from signup, stu_sign, courses "
            + "where coz_account=? and sg_coz_id = course_id "
            + "and ss_sign_id = sign_id group by sign_id";
    pool.query(sql, course_id, function(err, result, fields) {
        callback(err, result);
    });
}




