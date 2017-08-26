const mysql = require('promise-mysql');
const config = require('../controllers/config.js');

const pool = mysql.createPool(config.sql);

class UserError extends Error {
  constructor(msg) {
    super(msg || 'UserError');
    this.userError = true;
    this.status = 403;
  }
}

/**
 * getUser
 *
 * @param {string} account
 * @returns {Object} Promise
 * result account数据
 */
const getUser = (account) => {
  const sql = 'select * from users where account=?';
  return pool.query(sql, account).then((res) => {
    if (res.length === 0) {
      return Promise.reject(new UserError('用户不存在'));
    }
    return Promise.resolve(res);
  });
};

/**
 * login
 *
 * @param {string} account
 * @param {string} password 32位大写的MD5值
 * @returns {Object} Promise
 * result account数据
 * */
const login = (account, password) => getUser(account).then((res) => {
  if (res[0].password !== password) {
    return Promise.reject(new UserError('密码错误'));
  }
  return Promise.resolve(res);
});

/**
 * checkUser
 *
 * @param {string} account
 * @return {Object} Promise
 */
const checkUser = (account) => {
  const sql = 'select * from users where account=?';
  return pool.query(sql, account).then((res) => {
    if (res.length !== 0) {
      return Promise.reject(new UserError('用户名已被注册'));
    }
    return Promise.resolve();
  });
};

/**
 * checkEmail
 *
 * @param {string} email
 * @return {Object} Promise
 */
const checkEmail = (email) => {
  const sql = 'select account from users where email=?';
  return pool.query(sql, email).then((res) => {
    if (res.length) {
      return Promise.reject(new UserError('该邮箱已注册'));
    }
    return Promise.resolve();
  });
};

/**
 * verifyEmail
 *
 * @param {string} account
 * @param {string} email
 * @return {Object} Promise
 */
const verifyEmail = (account, email) => getUser(account).then((res) => {
  if (res[0].email !== email) {
    return Promise.reject(new UserError('用户名和邮箱不一致'));
  }
  return Promise.resolve(res);
});

/**
 * addUser
 *
 * @param {string} n_account
 * @param {string} n_password
 * @param {string} n_username
 * @param {string} n_email
 * @param {string} n_phone
 * @returns {Object} Promise
 */
const addUser = (...params) => {
  const sql = 'insert into users' +
    '(account, password, username, email, phone)' +
    ' values (?, ?, ?, ?, ?)';
  return pool.query(sql, params).catch((err) => {
    if (/ER_DUP_ENTRY/.test(err.message)) {
      return Promise.reject(new UserError('用户名已被注册'));
    }
    return Promise.reject(err);
  });
};

/**
 * updateUserInfo
 *
 * @param {string} account
 * @param {array} userinfo [username, email, phone]
 * @returns {Object} Promise
 */
const updateUserInfo = (account, userinfo) => {
  const sql = 'update users set ' +
    'username=?, email=?, phone=? where account=?';
  return pool.query(sql, [...userinfo, account]).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('账号不存在'));
    }
    return Promise.resolve();
  });
};

/**
 * updateUserPwd
 *
 * @param {string} account
 * @param {string} newpwd
 */
const updateUserPwd = (account, newpwd) => {
  const sql = 'update users set password=? where account=?';
  return pool.query(sql, [newpwd, account]).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('账户不存在'));
    }
    return Promise.resolve();
  });
};

/**
 * delUser
 *
 * @param {string} account
 * @returns {Object} Promise
 */
const delUser = (account) => {
  const sql = 'delete from users where account=?';
  return pool.query(sql, account).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('用户不存在'));
    }
    return Promise.resolve();
  });
};

/**
 * getCoursesByAccount
 *
 * @param {string} account
 * @returns {Object} Promise
 * result  [course_id, course_name, student_num]
 * 不判断account是否存在，result可以为[]
 */
const getCoursesByAccount = (account) => {
  const sql = 'select course_id, course_name, course_time, student_num ' +
    'from courses ' +
    'where coz_account=?';
  return pool.query(sql, account);
};

/**
 * addCourse
 *
 * @param {string} account
 * @param {string} course_name
 * @param {string} course_time
 * @param {string} course_info
 * @returns {Object} Promise
 * result  course_id
 */
const addCourse = (...params) => {
  const sql = 'insert into courses' +
    '(coz_account, course_name, course_time, course_info)' +
    ' values (?, ?, ?, ?)';
  return pool.query(sql, params).then(res => Promise.resolve(res.insertId));
};

/**
 * delCourse
 *
 * @param {number} courseId
 */
const delCourse = (courseId) => {
  const sql = 'delete from courses where course_id=?';
  return pool.query(sql, courseId).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('此课程不存在'));
    }
    return Promise.resolve();
  });
};

/**
 * getExamsByCourse
 *
 * @param {number} courseId
 * @returns {Object} Promise
 * select * from exams where ex_coz_id= ?
 * 等具体需求再修改
 */
const getExamsByCourse = (courseId) => {
  const sql = 'select * from exams ' +
    'where ex_coz_id=? ' +
    'order by exam_time desc';
  return pool.query(sql, courseId);
};


/**
 * addExam
 *
 * @param {number} courseId
 * @param {string} examName
 * @param {object} examQuestion json格式,详见文档
 * @returns {Object} Promise
 * result exam_id
 */
const addExam = (courseId, examName, examQuestion) => {
  const sql = 'insert into exams(exam_name, ex_coz_id, exam_question) ' +
    'values (?, ?, ?)';
  const parameter = [examName, courseId, examQuestion];
  return pool.query(sql, parameter).then(res => Promise.resolve(res.insertId));
};
/**
 * delExam
 *
 * @param {number} examId
 * @returns {Object} Promise
 */
const delExam = (examId) => {
  const sql = 'delete from exams where exam_id=?';
  return pool.query(sql, examId).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('测验不存在'));
    }
    return Promise.resolve();
  });
};

/**
 * updateExam
 *
 * @param {number} examId
 * @param {number} courseId
 * @param {string} examName
 * @param {object} examQuestion json格式,详见文档
 * @returns {Object} Promise
 */
const updateExam = (examId, examName, examQuestion) => {
  const sql = 'update exams set exam_name=?, exam_question=? ' +
    'where exam_id=?';
  const parameter = [examName, examQuestion, examId];
  return pool.query(sql, parameter).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('测验不存在'));
    }
    return Promise.resolve();
  });
};

/**
 * checkExam
 *
 * @param {string} account
 * @param {number} courseId
 * @param {number} examId
 * @returns {Object} Promise
 */
const checkExam = (account, courseId, examId) => {
  const sql = 'select coz_account from exams, courses ' +
    'where exam_id=? and ex_coz_id=? and course_id = ex_coz_id ' +
    'and coz_account=?';
  return pool.query(sql, [examId, courseId, account])
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject(new UserError('测验不存在'));
      }
      return Promise.resolve();
    });
};

/**
 * getExamById
 *
 * @param {number} examId
 * @returns {Object} Promise
 * [exam_id, ex_coz_id, exam_name, exam_question, exam_statistics]
 * exam_state, exam_time暂未使用
 *
 */
const getExamById = (examId) => {
  const sql = 'select * from exams where exam_id=?';
  return pool.query(sql, examId).then((res) => {
    if (res.length === 0) {
      return Promise.reject(new UserError('测验不存在'));
    }
    return Promise.resolve(res[0]);
  });
};

/**
 * getExamsByAccount
 *
 * @returns {Object} Promise
 * [course_id, exam_id, exam_name, name, exam_num, stu_num]
 *
 */
const getExamsByAccount = (account) => {
  const sql = 'select course_id, exam_id, exam_name, course_name as name, ' +
    'exam_stu_num as exam_num, student_num as stu_num ' +
    'from exams, courses ' +
    'where coz_account=? and ex_coz_id=course_id ' +
    'group by exam_id ' +
    'order by exam_time desc';
  return pool.query(sql, account);
};

/**
 * addSign
 *
 * @param {number} courseId
 * @returns {Object} Promise
 * signid
 *
 */
const addSign = (courseId) => {
  const sql = 'insert into signup set sg_coz_id=?';
  return pool.query(sql, courseId).then(res => Promise.resolve(res.insertId));
};

/**
 * studentSign
 *
 * @param {number} courseId
 * @param {number} signId
 * @param {number} stuId
 * @param {string} stuName
 * @returns {Object} Promise
 */
const studentSign = (courseId, signId, stuId, stuName) => {
  // 检查学号、姓名、课程相符
  const sql1 = 'select cs_stu_name from coz_stu ' +
    'where cs_coz_id=? and cs_stu_id=?';
  const parameter1 = [courseId, stuId];
  return pool.query(sql1, parameter1).then((res) => {
    if (res.length === 0) {
      return Promise.reject(new UserError('学号不在此课程内'));
    }
    if (res[0].cs_stu_name !== stuName) {
      return Promise.reject(new UserError('学号姓名不符'));
    }
    return Promise.resolve();
  }).then(() => {
    const sql2 = 'insert into stu_sign set ss_sign_id=?, ' +
      'ss_stu_id=?, ss_stu_name=?';
    const parameter2 = [signId, stuId, stuName];
    return pool.query(sql2, parameter2);
  }).catch((err) => {
    if (/ER_DUP_ENTRY/.test(err.message)) {
      return Promise.reject(new UserError('请勿重复签到'));
    }
    return Promise.reject(err);
  });
};

/**
 * addStudentsToCourse
 *
 * @param {number} courseId
 * @param {array} students
 * [ [stuId1, stuName1],
 * [stuId2, stuName2] ]
 * @returns {Object} Promise
 */
const addStudentsToCourse = (courseId, students) => {
  const parameter = students.map(s => [courseId, ...s]);
  const sql = 'insert into coz_stu' +
    '(cs_coz_id, cs_stu_id, cs_stu_name) values ?';
  return pool.query(sql, [parameter]);
};

/**
 * addStudent
 *
 * @param {array} student
 * [ [id1, name1],
 * [id2, name2] ]
 * @returns {Object} Promise
 */
const addStudent = (student) => {
  const sql = 'insert into students(student_id, student_name) values ?';
  return pool.query(sql, [student]);
};

/**
 * getSignsByCourse
 *
 * @param {number} courseId
 * @returns {Object} Promise
 * [{sign_id, time, sign_num, stu_num}]
 */
const getSignsByCourse = (courseId) => {
  const sql = 'select sign_id, sign_time as time, ' +
    'sg_stu_num as sign_num, ' +
    'student_num as stu_num ' +
    'from signup, courses ' +
    'where course_id = ? and sg_coz_id = course_id ' +
    'group by sign_id ' +
    'order by sign_time desc';
  return pool.query(sql, courseId);
};

/**
 * getSignById
 *
 * @param {number} signId
 * @returns {Object} Promise
 * [{course_id, id, name, time}]
 */
const getSignById = (signId) => {
  const sql = 'select sg_coz_id as course_id, ss_stu_id as stu_id, ' +
    'ss_stu_name as name, stu_sign_time as time ' +
    'from stu_sign, signup ' +
    'where sign_id=? and sign_id=ss_sign_id ' +
    'order by stu_sign_time';
  return pool.query(sql, signId);
};

/**
 * getSignsByAccount
 *
 * @param {number} account
 * @returns {Object} Promise
 * [{sign_id, course_id, name, time, sign_num, stu_num}]
 */
const getSignsByAccount = (account) => {
  const sql = 'select sign_id, course_id, course_name as name, ' +
    'sign_time as time, ' +
    'sg_stu_num as sign_num, student_num as stu_num ' +
    'from signup, courses ' +
    'where sg_coz_id=course_id and coz_account=? ' +
    'group by sign_id ' +
    'order by time desc';
  return pool.query(sql, account);
};

/**
 * checkSign
 *
 * @param {string} account
 * @param {number} courseId
 * @param {number} signId
 * @returns {Object} Promise
 */
const checkSign = (...params) => {
  const sql = 'select sign_id ' +
    'from courses, signup ' +
    'where coz_account=? and course_id=? ' +
    'and sg_coz_id=course_id and sign_id=?';
  return pool.query(sql, params)
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject(new UserError('签到不存在'));
      }
      return Promise.resolve();
    });
};

/**
 * getStudentsByCourse
 *
 * @param {number} courseId
 * @returns {Object} Promise
 * [id, name]
 */
const getStudentsByCourse = (courseId) => {
  const sql = 'select cs_stu_id as id, cs_stu_name as name ' +
    'from courses, coz_stu ' +
    'where course_id=? ' +
    'and cs_coz_id=course_id';
  return pool.query(sql, courseId);
};

/**
 * checkCourse
 *
 * @param {string} account
 * @param {number} courseId
 * @returns {Object} Promise
 */
const checkCourse = (account, courseId) => {
  const sql = 'select coz_account from courses ' +
    'where course_id=? ';
  return pool.query(sql, courseId).then((res) => {
    if (res.length === 0) {
      return Promise.reject(new UserError('此课程不存在'));
    }
    if (res[0].coz_account !== account) {
      return Promise.reject(new UserError('课程不属于该老师'));
    }
    return Promise.resolve();
  });
};

/**
 * getCourseById
 *
 * @param {number} courseId
 * @returns {Object} Promise
 * [course_name, course_time, course_info, student_num]
 */
const getCourseById = (courseId) => {
  const sql = 'select course_name, course_time, course_info, student_num ' +
    'from courses where course_id=?';
  return pool.query(sql, courseId).then((res) => {
    if (res.length === 0) {
      return Promise.reject(new UserError('此课程不存在'));
    }
    return Promise.resolve(res[0]);
  });
};

/**
 * updateCourse
 *
 * @param {number} courseId
 * @param {string} nCourseName
 * @param {string} nCourseTime
 * @param {string} nCourseInfo
 * @returns {Object} Promise
 */
const updateCourse = (courseId, ...params) => {
  const sql = 'update courses set course_name=?, course_time=?, ' +
    'course_info=? where course_id=?';
  const parameter = [...params, courseId];
  return pool.query(sql, parameter).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('此课程不存在'));
    }
    return Promise.resolve();
  });
};

/**
 * delSign
 *
 * @param {number} signId
 * @returns {Object} Promise
 */
const delSign = (signId) => {
  const sql = 'delete from signup where sign_id=?';
  return pool.query(sql, signId).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('此签到不存在'));
    }
    return Promise.resolve();
  });
};

/**
 * delstuofcoz
 *
 * @param {number} courseId
 * @returns {Object} Promise
 */
const delStudentsOfCourse = (courseId) => {
  const sql = 'delete from coz_stu where cs_coz_id=?';
  return pool.query(sql, courseId);
};

/**
 * addAnswer
 *
 * @param {number} examId
 * @param {number} stuId
 * @param {string} stuName
 * @param {number} score
 * @param {string} answer object to string
 * @return {Object} Promise
 * 这里不做任何检查，请保证插入数据正确！
 * 可使用checkstudent
 */
const addAnswer = (...params) => {
  const sql = 'insert into answers' +
    '(ans_ex_id, ans_stu_id, ans_stu_name, ans_score, ans_answer)' +
    ' values(?, ?, ?, ?, ?)';
  return pool.query(sql, params)
    .catch((err) => {
      if (/PRIMARY/.test(err)) {
        return Promise.reject(new UserError('请勿重复交卷'));
      }
      return Promise.reject(err);
    });
};


/**
 * checkStudent
 *
 * @param {number} stuId
 * @param {number} courseId
 * @param {string} stuName
 * @return {Object} Promise
 */
const checkStudent = (stuId, courseId, stuName) => {
  const sql = 'select cs_stu_name from coz_stu ' +
    'where cs_coz_id=? and cs_stu_id=?';
  const parameter = [courseId, stuId];
  return pool.query(sql, parameter).then((res) => {
    if (res.length === 0) {
      return Promise.reject(new UserError('学号不在此课程内'));
    }
    if (res[0].cs_stu_name !== stuName) {
      return Promise.reject(new UserError('学号姓名不符'));
    }
    return Promise.resolve();
  });
};

/**
 * getAnswerOfExam
 *
 * @param {number} examId
 * @return {Object} Promise
 * [student_id, student_name, score, answer]
 * 其他字段未给出，支持字段重命名
 */
const getAnswerOfExam = (examId) => {
  const sql = 'select ans_stu_id as student_id, ' +
    'ans_stu_name as student_name, ' +
    'ans_score as score, ' +
    'ans_answer as answer ' +
    'from answers ' +
    'where ans_ex_id=?';
  return pool.query(sql, examId);
};

/**
 * getAnswerOfStudent
 *
 * @param {number} examId
 * @param {number} stuId
 * @return {Object} Promise
 * [student_id, student_name, score, answer]
 * 其他字段未给出，支持字段重命名
 */
const getAnswerOfStudent = (...params) => {
  const sql = 'select ans_stu_id as student_id, ' +
    'ans_stu_name as student_name, ' +
    'ans_score as score, ' +
    'ans_answer as answer ' +
    'from answers ' +
    'where ans_ex_id=? and ans_stu_id=?';
  return pool.query(sql, params).then((res) => {
    if (res.length === 0) {
      return Promise.reject(new UserError('答卷不存在'));
    }
    return Promise.resolve(res);
  });
};

/**
 * copyexam
 *
 * @param {number} examID 源试卷id
 * @param {number} courseId 目标课程id
 * @return {Object} Promise
 * exam_id
 */
const copyexam = (examID, courseId) => {
  const sql = 'select * from exams where exam_id=?';
  return pool.query(sql, examID).then((res) => {
    if (res.length === 0) {
      return Promise.reject(new UserError('测验不存在'));
    }
    return addExam(courseId, res[0].exam_name, res[0].exam_question);
  });
};

/**
 * updatestatistics
 *
 * @param {number} examId
 * @param {string} statistics 新的统计结果
 * @return {Object} Promise
 */
const updatestatistics = (examId, statistics) => {
  const sql = 'update exams set exam_statistics = ? ' +
    'where exam_id = ?';
  return pool.query(sql, [statistics, examId]).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('测验不存在'));
    }
    return Promise.resolve();
  });
};
/**
 * delstusign
 *
 * @param {number} signId
 * @param {number} stuId
 * @return {Object} Promise
 */
const delstusign = (signId, stuId) => {
  const sql1 = 'delete from stu_sign ' +
    'where ss_sign_id=? and ss_stu_id=?';
  return pool.query(sql1, [signId, stuId]).then((res) => {
    if (res.affectedRows === 0) {
      return Promise.reject(new UserError('学生未签到'));
    }
    return Promise.resolve();
  }).then(() => {
    const sql2 = 'update signup set sg_stu_num=sg_stu_num-1 where sign_id = ?';
    return pool.query(sql2, signId);
  });
};

/**
 * statSignByCourse
 *
 * @param {number} courseId
 * @return {Object} Promise
 * [stu_id, stu_name, total, sign_num]
 */
const statSignByCourse = (courseId) => {
  const sql = 'select cs_stu_id as stu_id, cs_stu_name as stu_name, ' +
    'count(sign_id) as total, count(ss_sign_id) as sign_num ' +
    'from coz_stu ' +
    'inner join signup   on  cs_coz_id = sg_coz_id ' +
    'left join stu_sign  on  sign_id = ss_sign_id ' +
    '                        and ss_stu_id = cs_stu_id ' +
    'where cs_coz_id= ? ' +
    'group by cs_stu_id ';
  return pool.query(sql, courseId);
};

/**
 * statSignDetail
 *
 * @param {number} courseId
 * @param {number} studentId
 * @return {Object} Promise
 * [signId, time, stu_time]
 * time: 签到开始时间  stu_time：学生签到时间, 未签到为NULL
 */
const statSignDetail = (courseId, studentId) => {
  const sql = 'select sign_id, sign_time as time, ' +
    'stu_sign_time as stu_time ' +
    'from signup ' +
    'left join stu_sign on sign_id = ss_sign_id and ss_stu_id=? ' +
    'where sg_coz_id = ? ' +
    'order by sign_time desc';
  return pool.query(sql, [studentId, courseId]);
};

/**
 * statsexambycourse
 *
 * @param {number} courseId
 * @return {Object} Promise
 * [stuId, stu_name, total, exam_num, sum_score]
 */
const statsexambycourse = (courseId) => {
  const sql = 'select cs_stu_id as stu_id, cs_stu_name as stu_name, ' +
    'count(exam_id) as total, count(ans_ex_id) as exam_num, ' +
    'sum(ans_score) as sum_score ' +
    'from coz_stu ' +
    'inner join exams  on cs_coz_id = ex_coz_id ' +
    'left join answers on exam_id = ans_ex_id ' +
    '                     and ans_stu_id = cs_stu_id ' +
    'where cs_coz_id= ? ' +
    'group by cs_stu_id ';
  return pool.query(sql, courseId);
};

/**
 * statsexamdetail
 *
 * @param {number} courseId
 * @param {number} studentId
 * @return {Object} Promise
 * [exam_id, exam_name, score, time]
 */
const statsexamdetail = (courseId, studentId) => {
  const sql = 'select exam_id, exam_name, ans_score as score, ' +
    'ans_time as time ' +
    'from exams ' +
    'left join answers on exam_id = ans_ex_id and ans_stu_id=? ' +
    'where ex_coz_id = ? ' +
    'order by exam_time desc ';
  return pool.query(sql, [studentId, courseId]);
};

const getAllSignByCourse = (courseId) => {
  const sql = 'select cs_stu_id as stu_id, sign_id, stu_sign_time as sign ' +
    'from coz_stu ' +
    'inner join signup on cs_coz_id = sg_coz_id ' +
    'left join stu_sign on sign_id = ss_sign_id ' +
    'and cs_stu_id = ss_stu_id ' +
    'where cs_coz_id = ?';
  return pool.query(sql, courseId);
};

const getAllExamByCourse = (courseId) => {
  const sql = 'select cs_stu_id as stu_id, exam_id, ans_score as score ' +
    'from coz_stu ' +
    'inner join exams on cs_coz_id = ex_coz_id ' +
    'left join answers on exam_id = ans_ex_id ' +
    'and ans_stu_id = cs_stu_id ' +
    'where cs_coz_id = ?';
  return pool.query(sql, courseId);
};

module.exports = {
  UserError,
  getAllExamByCourse,
  getAllSignByCourse,
  login,
  getUser,
  addUser,
  delUser,
  checkUser,
  checkEmail,
  verifyEmail,
  updateUserInfo,
  updateUserPwd,
  addCourse,
  delCourse,
  updateCourse,
  getCourseById,
  getCoursesByAccount,
  addStudentsToCourse,
  delStudentsOfCourse,
  getStudentsByCourse,
  checkCourse,
  checkStudent,
  addExam,
  delExam,
  updateExam,
  updatestatistics,
  copyexam,
  getExamById,
  getExamsByCourse,
  getExamsByAccount,
  statsexambycourse,
  statsexamdetail,
  checkExam,
  addSign,
  delSign,
  delstusign,
  studentSign,
  getSignById,
  getSignsByAccount,
  getSignsByCourse,
  statSignByCourse,
  statSignDetail,
  checkSign,
  addAnswer,
  getAnswerOfExam,
  getAnswerOfStudent,
  addStudent,
};
