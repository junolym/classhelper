var mongoose = require('mongoose');
var User = require('./User.js');
var Course = require('./Course.js');
var Exam = require('./Exam.js');

// callback(err, doc)
exports.getuserbyname = function(username, callback) {  // OK
    User.findOne({user: username}, callback);
}

exports.adduser = function(user, callback) {    // OK
    var user_ = new User(user);
    user_.save(callback);
}

exports.deluser = function(userID, callback) {
    var promise = User.fiAndById(userID).exec();
    promise.then(function(doc) {
        // 删除所教课程
        if (doc && doc.course) {
            for (var i = 0; i < doc.course.length; ++i) {
                delcourseonly(doc.course[i]);
            }
        }
    }).then(function() {
        // 删除用户
        User.remove({_id : userID}, callback);
    });
}

exports.getcourse = function(courseID, callback) {
    // callback(err, doc)
    Course.findById(courseID, callback);
}

exports.addcourse = function(course, userID, callback) {    // OK
    var course_ = new Course(course);

    // 添加课程
    course_.save(function(err, doc) {
        // 修改教师的课程表
        User.update({_id : userID}, {$push: {'course' : doc.id}}, function(err, user) {
            callback(err, doc);
        });
    }); 
}

exports.delcourse = function(courseID, userID, callback) {  // OK
    // 修改教师课程表
    User.update({_id : userID}, {$pull : {'course' : courseID}},
                        function(err, doc) {
        if (!err && doc && doc.ok == 1) {
            // 删除课程
            delcourseonly(courseID, callback);
        } else {
            callback('delcourse error!');   // 该老师不教此门课，请自定义callback返回值
        }
    });
}

exports.addexam = function(exam, courseID, callback) {  // OK
    var exam_ = new Exam(exam);
    exam_.save(function(err, doc) {
        if (!err && doc) {
            Course.update({_id: courseID}, 
                {$push : {'exam' : {'name':exam.name, '_id': doc.id}}}, 
                callback);  // callback返回Course修改情况
        }
    });
}

exports.delexam = function(examID, courseID, callback) {
    Course.update({_id : courseID}, {$pull : {'exam' : {'id': examID}}}, function(err, doc) {
        if (!err && doc.ok == 1) {
            // 删除试卷
            delexamonly(examID, callback);
        } else {
            // 该课程没此份试卷，自定义返回err
            callback('exam not found', '');
        }
    });
}

var delcourseonly = function(courseID, callback) {      // OK
    var promise = Course.findById(courseID).exec();
    promise.then(function(doc) {
        // 若课程存在且相应试卷，删试卷
        if (doc && doc.exam) {
            for (var i = 0; i < doc.exam.length; ++i) {
                delexamonly(doc.exam[i]._id, function(err, doc){});
            }
        }
    }).then(function(doc) {
        // 删课程
        Course.remove({_id: courseID}, callback);
    });
}

var delexamonly = function(examID, callback) {  // OK
    Exam.remove({_id : examID}, callback);
}
