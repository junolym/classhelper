callback(err, result)

exports.login = function(account, password, callback)   // OK
err=0  用户不存在  
err=2  密码错误    
result account数据 

exports.getuser = function(account, callback)           // OK
err=1  用户不存在  
result account数据 

exports.adduser = function(admin, newuser, callback)    // OK
admin   管理账户
err1    账户不存在  
err2    权限不足    
result  新用户id

exports.deluser = function(account, callback)           // OK
result  删除行数

exports.getcoursebyaccount = function(account, callback)
result  course_id, course_name

exports.addcourse = function(course, callback)          // OK
result  course_id

exports.delcourse = function(course_id, callback)
result  删除行数

exports.getexambycourse = function(course_id, callback)
result  exam_id, exam_name, exam_state, exam_time

exports.addexam = function(exam, callback) 
result  exam_id

exports.delexam = function(course_id, callback)
result  删除行数

exports.addsign = function(course_id, callback)         // OK
result  sign_id

exports.studentsign = function(sign_id, student_id)
result  

