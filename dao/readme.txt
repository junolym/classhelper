callback(err, result)
普通插入数据为json

exports.login = function(account, password, callback)   // OK
err=1  用户不存在  
err=2  密码错误    
result account数据 

exports.getuser = function(account, callback)           // OK
err=1  用户不存在  
result account数据 

exports.adduser = function(admin, newuser, callback)    // OK
admin   管理账户
err=1   账户不存在  
err=2   权限不足    
result  新用户id

exports.deluser = function(account, callback)           // OK
result  删除行数

exports.getcoursebyaccount = function(account, callback)    //OK
result  course_id, course_name
// 不判断account是否存在，result可以为[]

exports.addcourse = function(course, callback)          // OK
result  course_id

exports.delcourse = function(course_id, callback)       // OK
result  删除行数

exports.getexambycourse = function(course_id, callback) 
result  *

exports.addexam = function(exam, callback)
result  exam_id

exports.delexam = function(course_id, callback)
result  删除行数

exports.addsign = function(course_id, callback)         // OK
result  sign_id

exports.studentsign = function(sign_id, student, callback)
student = {
    id:     xxx,
    name:   xxx;
}
err=1  student.id 不在此课程中
err=2  学号名字不符合
result  

exports.addstutocourse = function(course_student, callback) 
可插入多组student, 不检查学号名字的相容性 格式     
[ [course_id1, student_id1, student_name1],
  [course_id2, student_id2, student_name2] ]

exports.addstudent = function(student, callback)        // OK
可插入多组student, 格式     // student.js 储存14级软院数据
[ [id1, name1],
  [id2, name2] ]

