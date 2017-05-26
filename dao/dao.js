var mysql = require('promise-mysql');
var pool  = mysql.createPool({
    host: 'classhelper.ml',
    user: 'root',
    password: 'sysusdcs',
    database: 'test',
    charset: 'utf8mb4_unicode_ci'
});

function UserError (message) {
    this.message = message || 'UserError';
    this.userError = true;
    this.status = 403;
};
UserError.prototype = new Error();
UserError.prototype.constructor = UserError;
exports.UserError = UserError;



/**
 * login
 *
 * @param {string} account
 * @param {string} password 32位大写的MD5值
 * @returns {Object} Promise
 * result account数据
 * */
var login = function(account, password) {
    return getuser(account).then(function(result) {
        if (result[0].password != password) {
            return Promise.reject(new UserError('密码错误'));
        } else {
            return Promise.resolve(result);
        }
    });
};

/**
 * getuser
 *
 * @param {string} account
 * @returns {Object} Promise
 * result account数据
 */
var getuser = function getuser(account) {
    var sql = "select * from users where account=?"
    return pool.query(sql, account).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('用户不存在'));
        } else {
            return Promise.resolve(result);
        }
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
 * @returns {Object} Promise
 */
var adduser = function(admin, n_account, n_password, n_username,
                            n_email, n_phone) {
    // 权限
    var sql = "select admin from users where account=?";
    return pool.query(sql, admin).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('用户不存在'));
        } else if (result[0].admin == 0) {
            return Promise.reject(new UserError('没有添加用户的权限'));
        } else {
            return Promise.resolve();
        }
    }).then(function() {
        sql = "insert into users(account, password, username, "
            + "email, phone) values (?, ?, ?, ?, ?)";
        return pool.query(sql, [n_account, n_password, n_username, n_email,
                        n_phone]);
    });
};

/**
 * updateuserinfo
 *
 * @param {string} account
 * @param {array} userinfo [username, email, phone]
 * @returns {Object} Promise
 */
var updateuserinfo = function(account, userinfo) {
    var sql = "update users set username=?, email=?, phone=? "
            + "where account=?";
    var parameter = userinfo;
    parameter.push(account);
    return pool.query(sql, parameter).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError('账号不存在'));
        } else {
            return Promise.resolve();
        }
    });
};

/**
 * updateuserpwd
 *
 * @param {string} account
 * @param {string} oldpwd
 * @param {string} newpwd
 */
var updateuserpwd = function(account, oldpwd, newpwd) {
    var sql = "update users set password=? "
            + "where account=? and password=?";
    return pool.query(sql, [newpwd,account,oldpwd]).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError('密码验证失败'));
        } else {
            return Promise.resolve();
        }
    });
};

/**
 * deluser
 *
 * @param {string} account
 * @returns {Object} Promise
 */
var deluser = function(account) {
    var sql = "delete from users where account=?";
    return pool.query(sql, account).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError('用户不存在！'));
        } else {
            return Promise.resolve();
        }
    });
};

/**
 * getcoursebyaccount
 *
 * @param {string} account
 * @returns {Object} Promise
 * result  [course_id, course_name, student_num]
 * 不判断account是否存在，result可以为[]
 */
var getcoursebyaccount = function(account) {
    var sql = "select course_id, course_name, course_time, student_num "
            + "from courses "
            + "where coz_account=?";
    return pool.query(sql, account);
};

/**
 * addcourse
 *
 * @param {string} account
 * @param {string} course_name
 * @param {string} course_time
 * @param {string} course_info
 * @returns {Object} Promise
 * result  course_id
 */
var addcourse=function(account, course_name, course_time, course_info){
    var sql = "insert into courses(coz_account, course_name, "
            + "course_time, course_info) values (?, ?, ?, ?)";
    var parameter = [account, course_name, course_time, course_info];
    return pool.query(sql, parameter).then(function(result) {
        return Promise.resolve(result.insertId);
    });
};

/**
 * delcourse
 *
 * @param {number} course_id
 */
var delcourse = function(course_id) {
    var sql = "delete from courses where course_id=?";
    return pool.query(sql, course_id).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError('此课程不存在！'));
        } else {
            return Promise.resolve();
        }
    });
};

/**
 * getexambycourse
 *
 * @param {number} course_id
 * @returns {Object} Promise
 * select * from exams where ex_coz_id= ?
 * 等具体需求再修改
 */
var getexambycourse = function(course_id) {
    var sql = "select * from exams " 
            + "where ex_coz_id=? "
            + "order by exam_time desc";
    return pool.query(sql, course_id)
};


/**
 * addexam
 *
 * @param {number} course_id
 * @param {string} exam_name
 * @param {object} exam_question json格式,详见文档
 * @returns {Object} Promise
 * result exam_id
 */
var addexam = function(course_id, exam_name, exam_question) {
    var sql = "insert into exams(exam_name, ex_coz_id, exam_question) "
            + "values (?, ?, ?)";
    var parameter = [exam_name, course_id, exam_question];
    return pool.query(sql, parameter).then(function(result) {
        return Promise.resolve(result.insertId);
    });
};

/**
 * delexam
 *
 * @param {number} exam_id
 * @returns {Object} Promise
 */
var delexam = function(exam_id) {
    var sql = "delete from exams where exam_id=?";
    return pool.query(sql, exam_id).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError('测试不存在'));
        } else {
            return Promise.resolve();
        }
    });
};

/**
 * updateexam
 *
 * @param {number} exam_id
 * @param {number} course_id
 * @param {string} exam_name
 * @param {object} exam_question json格式,详见文档
 * @returns {Object} Promise
 */
var updateexam = function(exam_id, exam_name, exam_question) {
    var sql = "update exams set exam_name=?, exam_question=? "
            + "where exam_id=?";
    var parameter = [exam_name, exam_question, exam_id];
    return pool.query(sql, parameter).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError('测试不存在'));
        } else {
            return Promise.resolve();
        }
    });
};

/**
 * checkexam
 *
 * @param {string} account
 * @param {number} course_id
 * @param {number} exam_id
 * @returns {Object} Promise
 */
var checkexam = function(account, course_id, exam_id) {
    var sql = "select coz_account from exams, courses "
            + "where exam_id=? and ex_coz_id=? and course_id = ex_coz_id "
            + "and coz_account=?";
    return pool.query(sql, [exam_id, course_id, account])
    .then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('测验校验失败'));
        } else {
            return Promise.resolve();
        }
    });
}

/**
 * getexambyid
 *
 * @param {number} exam_id
 * @returns {Object} Promise
 * [exam_id, ex_coz_id, exam_name, exam_question, exam_statistics]
 * exam_state, exam_time暂未使用
 *
 */
var getexambyid = function(exam_id) {
    var sql = "select * from exams where exam_id=?";
    return pool.query(sql, exam_id).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('该试卷不存在'));
        } else {
            return Promise.resolve(result);
        }
    });
}

/**
 * getexambyaccount
 *
 * @returns {Object} Promise
 * [course_id, exam_id, exam_name, name, exam_num, stu_num]
 *
 */
var getexambyaccount = function(account) {
    var sql = "select course_id, exam_id, exam_name, course_name as name, "
            + "exam_stu_num as exam_num, student_num as stu_num "
            + "from exams, courses "
            + "where coz_account=? and ex_coz_id=course_id "
            + "group by exam_id "
            + "order by exam_time desc";
    return pool.query(sql, account);
}

/**
 * addsign
 *
 * @param {number} course_id
 * @returns {Object} Promise
 * signid
 *
 */
var addsign = function(course_id) {
    var sql = "insert into signup set sg_coz_id=?";
    return pool.query(sql, course_id).then(function(result) {
        return Promise.resolve(result.insertId);
    });
};

/**
 * studentsign
 *
 * @param {number} course_id
 * @param {number} sign_id
 * @param {number} stu_id
 * @param {string} stu_name
 * @returns {Object} Promise
 */
var studentsign = function(course_id, sign_id, stu_id,
                                stu_name) {
    // 检查学号、姓名、课程相符
    var sql = "select cs_stu_name from coz_stu "
            + "where cs_coz_id=? and cs_stu_id=?";
    var parameter = [course_id, stu_id];
    return pool.query(sql, parameter).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('学号不在此课程内'));
        } else if (result[0].cs_stu_name != stu_name) {
            return Promise.reject(new UserError('学号姓名不符'));
        } else {
            return Promise.resolve();
        }
    }).then(function(result) {
        var sql = "insert into stu_sign set ss_sign_id=?, "
                + "ss_stu_id=?, ss_stu_name=?"
        var parameter = [sign_id, stu_id, stu_name];
        return pool.query(sql, parameter);
    }).catch(function(err) {
        if (/PRIMARY/.test(err)) {
            return Promise.reject(new UserError('请勿重复签到'));
        }
        return Promise.reject(err);
    });
};

/**
 * addstutocourse
 *
 * @param {number} course_id
 * @param {array} coz_stu
 * [ [stu_id1, stu_name1],
 * [stu_id2, stu_name2] ]
 * @returns {Object} Promise
 */
var addstutocourse = function(course_id, coz_stu) {
    var parameter = [];
    for (var i in coz_stu) {
        parameter.push([course_id, coz_stu[i][0], coz_stu[i][1]]);
    }
    var sql = "insert into coz_stu(cs_coz_id, cs_stu_id, "
            + "cs_stu_name) values ?";
    return pool.query(sql, [parameter]);
};

/**
 * addstudent
 *
 * @param {array} student
 * [ [id1, name1],
 * [id2, name2] ]
 * @returns {Object} Promise
 */
var addstudent = function(student) {
    var sql = "insert into students(student_id, student_name) values ?";
    return pool.query(sql, [student]);
};

/**
 * getsigncourse
 *
 * @param {number} course_id
 * @returns {Object} Promise
 * [{sign_id, time, sign_num, stu_num}]
 */
var getsignbycourse = function(course_id) {
    var sql = "select sign_id, sign_time as time, "
            + "sg_stu_num as sign_num, "
            + "student_num as stu_num "
            + "from signup, courses "
            + "where course_id = ? and sg_coz_id = course_id "
            + "group by sign_id "
            + "order by sign_time desc";
    return pool.query(sql, course_id);
}

/**
 * getsignbyid
 *
 * @param {number} sign_id
 * @returns {Object} Promise
 * [{course_id, id, name, time}]
 */
var getsignbyid = function(sign_id) {
    var sql = "select sg_coz_id as course_id, ss_stu_id as stu_id, "
            + "ss_stu_name as name, stu_sign_time as time "
            + "from stu_sign, signup "
            + "where sign_id=? and sign_id=ss_sign_id "
            + "order by stu_sign_time";
    return pool.query(sql, sign_id);
}

/**
 * getsignbyaccount
 *
 * @param {number} account
 * @returns {Object} Promise
 * [{sign_id, course_id, name, time, sign_num, stu_num}]
 */
var getsignbyaccount = function(account) {
    var sql = "select sign_id, course_id, course_name as name, "
            + "sign_time as time, "
            + "sg_stu_num as sign_num, student_num as stu_num "
            + "from signup, courses "
            + "where sg_coz_id=course_id and coz_account=? "
            + "group by sign_id "
            + "order by time desc";
    return pool.query(sql, account);
}

/**
 * checksign
 *
 * @param {string} account
 * @param {number} course_id
 * @param {number} sign_id
 * @returns {Object} Promise
 */
var checksign = function(account, course_id, sign_id) {
    var sql = "select sign_id "
            + "from courses, signup "
            + "where coz_account=? and course_id=? "
            + "and sg_coz_id=course_id and sign_id=?";
    return pool.query(sql, [account, course_id, sign_id])
    .then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('签到id校验失败'));
        } else {
            return Promise.resolve();
        }
    });
}

/**
 * getstubycourse
 *
 * @param {number} course_id
 * @returns {Object} Promise
 * [id, name]
 */
var getstubycourse = function(course_id) {
    var sql = "select cs_stu_id as id, cs_stu_name as name "
            + "from courses, coz_stu "
            + "where course_id=? "
            + "and cs_coz_id=course_id";
    return pool.query(sql, course_id);
}

/**
 * checkcourse
 *
 * @param {string} account
 * @param {number} course_id
 * @returns {Object} Promise
 */
var checkcourse = function(account, course_id) {
    var sql = "select coz_account from courses "
            + "where course_id=? ";
    return pool.query(sql, course_id).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('此课程不存在'));
        } else if (result[0].coz_account != account) {
            return Promise.reject(new UserError('课程不属于该老师'));
        } else {
            return Promise.resolve();
        }
    });
}

/**
 * getcoursebyid
 *
 * @param {number} course_id
 * @returns {Object} Promise
 * [course_name, course_time, course_info, student_num]
 */
var getcoursebyid = function(course_id) {
    var sql = "select course_name, course_time, course_info, student_num "
            + "from courses where course_id=?"
    return pool.query(sql, course_id).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('此课程不存在'));
        } else {
            return Promise.resolve(result);
        }
    });
}

/**
 * updatecourse
 *
 * @param {number} course_id
 * @param {string} n_course_name
 * @param {string} n_course_time
 * @param {string} n_course_info
 * @returns {Object} Promise
 */
var updatecourse = function(course_id, n_course_name, n_course_time,
                                n_course_info) {
    var sql = "update courses set course_name=?, course_time=?, "
            + "course_info=? where course_id=?"
    var parameter=[n_course_name, n_course_time, n_course_info, course_id];
    return pool.query(sql, parameter).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError('此课程不存在'));
        } else {
            return Promise.resolve();
        }
    });
}

/**
 * delsign
 *
 * @param {number} sign_id
 * @returns {Object} Promise
 */
var delsign = function(sign_id) {
    var sql = 'delete from signup where sign_id=?';
    return pool.query(sql, sign_id).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError('此签到不存在'));
        } else {
            return Promise.resolve();
        }
    });
}

/**
 * delstuofcoz
 *
 * @param {number} course_id
 * @returns {Object} Promise
 */
var delstuofcourse = function(course_id) {
    var sql = 'delete from coz_stu where cs_coz_id=?';
    return pool.query(sql, course_id);
}

/**
 * addanswer
 *
 * @param {number} exam_id
 * @param {number} stu_id
 * @param {string} stu_name
 * @param {number} score
 * @param {string} answer object to string
 * @return {Object} Promise
 * 这里不做任何检查，请保证插入数据正确！
 * 可使用checkstudent
 */
var addanswer = function(exam_id, stu_id, stu_name, score, answer) {
    var sql = "insert into answers(ans_ex_id, ans_stu_id, ans_stu_name, "
            + "ans_score, ans_answer) values(?, ?, ?, ?, ?)";
    return pool.query(sql, [exam_id, stu_id, stu_name, score, answer])
        .catch(function(err) {
            if (/PRIMARY/.test(err)) {
                return Promise.reject(new UserError('请勿重复交卷'));
            }
            return Promise.reject(err);
        });
}


/**
 * checkstudent
 *
 * @param {number} stu_id
 * @param {number} course_id
 * @param {string} stu_name
 * @return {Object} Promise
 */
var checkstudent = function(stu_id, course_id, stu_name) {
    var sql = "select cs_stu_name from coz_stu "
            + "where cs_coz_id=? and cs_stu_id=?";
    var parameter = [course_id, stu_id];
    return pool.query(sql, parameter).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('学号不在此课程内'));
        } else if (result[0].cs_stu_name != stu_name) {
            return Promise.reject(new UserError('学号姓名不符'));
        } else {
            return Promise.resolve();
        }
    });
}

/**
 * getanswerbyexam
 *
 * @param {number} exam_id
 * @return {Object} Promise
 * [student_id, student_name, score, answer]
 * 其他字段未给出，支持字段重命名
 */
var getanswerbyexam = function(exam_id) {
    var sql = "select ans_stu_id as student_id, "
            + "ans_stu_name as student_name, "
            + "ans_score as score, "
            + "ans_answer as answer "
            + "from answers "
            + "where ans_ex_id=?";
    return pool.query(sql, exam_id);
}

/**
 * getanswerbystudent
 *
 * @param {number} exam_id
 * @param {number} stu_id
 * @return {Object} Promise
 * [student_id, student_name, score, answer]
 * 其他字段未给出，支持字段重命名
 */
var getanswerbystudent = function(exam_id, stu_id) {
    var sql = "select ans_stu_id as student_id, "
            + "ans_stu_name as student_name, "
            + "ans_score as score, "
            + "ans_answer as answer "
            + "from answers "
            + "where ans_ex_id=? and ans_stu_id=?";
    return pool.query(sql, [exam_id, stu_id]).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('答卷不存在!'));
        } else {
            return Promise.resolve(result);
        }
    });
}

/**
 * copyexam
 *
 * @param {number} src_exam_id 源试卷id
 * @param {number} des_course_id 目标课程id
 * @return {Object} Promise
 * exam_id
 */
var copyexam = function(src_exam_id, des_course_id) {
    var sql = "select * from exams where exam_id=?";
    return pool.query(sql, src_exam_id).then(function(result) {
        if (result.length == 0) {
            return Promise.reject(new UserError('测验不存在!'));
        } else {
            console.log(result);
            return addexam(des_course_id, result[0].exam_name, 
                            result[0].exam_question);
        }
    });
}

/**
 * updatestatistics
 *
 * @param {number} exam_id
 * @param {string} statistics 新的统计结果
 * @return {Object} Promise
 */
var updatestatistics = function(exam_id, statistics) {
    var sql = "update exams set exam_statistics = ? "
            + "where exam_id = ?";
    return pool.query(sql, [statistics, exam_id]).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError("该测验不存在"));
        } else {
            return Promise.resolve();
        }
    });
}
/**
 * delstusign
 *
 * @param {number} sign_id
 * @param {number} stu_id
 * @return {Object} Promise
 */
var delstusign = function(sign_id, stu_id) {
    var sql = "delete from stu_sign " 
            + "where ss_sign_id=? and ss_stu_id=?";
    return pool.query(sql, [sign_id, stu_id]).then(function(result) {
        if (result.affectedRows == 0) {
            return Promise.reject(new UserError("该学生未签到!"));
        } else {
            return Promise.resolve();
        }
    })
}

/**
 * statssignbycourse
 *
 * @param {number} course_id
 * @return {Object} Promise
 * [stu_id, stu_name, total, sign_num]
 */
var statssignbycourse = function(course_id) {
    var sql = "select cs_stu_id as stu_id, cs_stu_name as stu_name, "
            + "count(sign_id) as total, count(ss_sign_id) as sign_num "
            + "from coz_stu "
            + "inner join signup   on  cs_coz_id = sg_coz_id "
            + "left join stu_sign  on  sign_id = ss_sign_id "
            + "                        and ss_stu_id = cs_stu_id "  
            + "where cs_coz_id= ? "
            + "group by cs_stu_id ";
    return pool.query(sql, course_id);
}

/**
 * statssigndetail
 *
 * @param {number} course_id
 * @param {number} student_id
 * @return {Object} Promise
 * [time, stu_time]
 * time: 签到开始时间  stu_time：学生签到时间, 未签到为NULL
 */
var statssigndetail = function(course_id, student_id) {
    var sql = "select sign_time as time, stu_sign_time as stu_time "
            + "from signup "
            + "left join stu_sign on sign_id = ss_sign_id and ss_stu_id=? "
            + "where sg_coz_id = ? ";
    return pool.query(sql, [student_id, course_id]);
}

/**
 * statsexambycourse
 *
 * @param {number} course_id
 * @return {Object} Promise
 * [stu_id, stu_name, total, exam_num, sum_score]
 */
var statsexambycourse = function(course_id) {
    var sql = "select cs_stu_id as stu_id, cs_stu_name as stu_name, "
            + "count(exam_id) as total, count(ans_ex_id) as exam_num, "
            + "sum(ans_score) as sum_score "
            + "from coz_stu "
            + "inner join exams  on cs_coz_id = ex_coz_id "
            + "left join answers on exam_id = ans_ex_id "
            + "                     and ans_stu_id = cs_stu_id "  
            + "where cs_coz_id= ? "
            + "group by cs_stu_id ";
    return pool.query(sql, course_id);
}

/**
 * statsexamdetail
 *
 * @param {number} course_id
 * @param {number} student_id
 * @return {Object} Promise
 * [exam_id, exam_name, score, time]
 */
var statsexamdetail = function(course_id, student_id) {
    var sql = "select exam_id, exam_name, ans_score as score, "
            + "ans_time as time "
            + "from exams "
            + "left join answers on exam_id = ans_ex_id and ans_stu_id=? "
            + "where ex_coz_id = ? ";
    return pool.query(sql, [student_id, course_id]);
}

exports.login = login;
exports.getuser = getuser;
exports.adduser = adduser;
exports.deluser = deluser;
exports.updateuserinfo = updateuserinfo;
exports.updateuserpwd = updateuserpwd;

exports.addcourse = addcourse;
exports.delcourse = delcourse;
exports.updatecourse = updatecourse;
exports.getcoursebyid = getcoursebyid;
exports.getcoursebyaccount = getcoursebyaccount;
exports.addstutocourse = addstutocourse;
exports.delstuofcourse = delstuofcourse;
exports.getstubycourse = getstubycourse;
exports.checkcourse = checkcourse;
exports.checkstudent = checkstudent;

exports.addexam = addexam;
exports.delexam = delexam;
exports.updateexam = updateexam;
exports.updatestatistics = updatestatistics;
exports.copyexam = copyexam;
exports.getexambyid = getexambyid;
exports.getexambycourse = getexambycourse;
exports.getexambyaccount = getexambyaccount;
exports.statsexambycourse = statsexambycourse;
exports.statsexamdetail = statsexamdetail;
exports.checkexam = checkexam;

exports.addsign = addsign;
exports.delsign = delsign;
exports.delstusign = delstusign;
exports.studentsign = studentsign;
exports.getsignbyid = getsignbyid;
exports.getsignbyaccount = getsignbyaccount;
exports.getsignbycourse = getsignbycourse;
exports.statssignbycourse = statssignbycourse;
exports.statssigndetail = statssigndetail;
exports.checksign = checksign;

exports.addanswer = addanswer;
exports.getanswerbyexam = getanswerbyexam;
exports.getanswerbystudent = getanswerbystudent;

exports.addstudent = addstudent;
