var mongoose = require('mongoose');
var User = require('./User.js');
var Course = require('./Course.js');
var Exam = require('./Exam.js');

// callback(err, doc)
exports.getuserbyname = function(username, callback) {  // OK
    User.findOne({user: username}, callback);
}

exports.adduser = function(user, callback) {
    var user_ = new User(user);
    user_save(callback);
}

exports.deluser = function(userID, callback) {
    User.findById(userID, function(err, doc) {
        if (!err && doc && doc.course) {
            for (var i = 0; i < doc.course.length; ++i) {
                delcourseonly(doc.course[i]);
            }
        }
        User.remove({_id : userID});
    });
    // callback
}

exports.getcourse = function(courseID, callback) {
    Course.findById(courseID, callback);
}

exports.addcourse = function(course, userID, callback) {    // OK
    var course_ = new Course(course);
    course_.save(function(err, doc) {
        // 修改教师的课程表
        User.update({_id : userID}, {$push: {'course' : doc.id}}, function(err, user) {
            callback(doc);
        });
    }); 
}

exports.delcourse = function(courseID, userID, callback) {  // OK
    delcourseonly(courseID);
    // 修改教师课程表
    User.update({_id : userID}, {$pull : {'course' : courseID}}, function(err, doc) {
    });
}

exports.addexam = function(exam, courseID, callback) {  // OK
    var exam_ = new Exam(exam);
    exam_.save(function(err, doc) {
        Course.update({_id: courseID}, {$push : {'exam' : {'name':exam.name, '_id': doc.id}}}, function(err, doc) {
        });
    });
}

exports.delexam = function(examID, courseID, callback) {
    Course.update({_id : courseID}, {$pull : {'exam' : {'id': examID}}});
    delexamonly(examID);
}

var delcourseonly = function(courseID, callback) {
    Course.findById(courseID, function(err, doc) {
        if (!err && doc && doc.exam) {
            for (var i = 0; i < doc.exam.length; ++i) {
                delexamonly(doc.exam[i]);
            }
            Course.remove({_id: courseID}, function(err, del) {
                console.log('delete course ' + doc.name);
            });
        } else {
            console.log('delete course failure!');
        }
    });
}

var delexamonly = function(examID, callback) {
    Exam.remove({_id : examID}, function(err, doc) {
        console.log('delete exam id ' + examID);
    });
}

