var mongoose = require('mongoose');
var User = require('./User.js');
var Course = require('./Course.js');
var Exam = require('./Exam.js');

// callback(err, doc)
exports.getuserbyname = function(username, callback) {  // OK
    User.findOne({user: username}).exec(callback);
};

// 请提供callback需要的参数
exports.adduser = function(user, callback) {    // OK
    var user_ = new User(user);
    user_.save(function(err, doc) {
        if (!err &&  doc) {
            console.log('Add user ' + doc.name + doc.id);
        } else {
            console.log('Add user ' + doc.name + 'failure');
            console.log(err);
        }
        callback(err, doc);
    });
};

exports.deluser = function(userID, callback) {
    console.log('delete user ' + userID + ' begin');
    var promise = User.findById(userID).exec();
    var coursearr = new Array;
    promise.then(function(doc) {
        // 删除所教课程
        if (doc && doc.course) {
            for (var i = 0; i < doc.course.length; ++i) {
                coursearr.push(delcourseonly(doc.course[i], 
                    function(err, doc) {}));
            }
        }
    });
    Promise.all(coursearr).then(function(doc) {
        // 删除用户
        User.remove({_id : userID}, function(err, doc) {
            if (doc && doc.result.ok == 1) {
                console.log('delete user success!');
            } else {
                console.log('delete user failure!');
            }
            callback(err, doc);
        });
    }).catch(function(err) {
        console.log('delete user failure!');
        console.log(err);
        callback(err, null);
    });
};

exports.getcourse = function(courseID, callback) {
    // callback(err, doc)
    Course.findById(courseID).exec(callback);
};

exports.addcourse = function(course, userID, callback) {    // OK
    var course_ = new Course(course);

    // 添加课程
    course_.save(function(err, doc) {
        // 修改教师的课程表
        User.update({_id : userID}, {$push: {'course' : doc.id}}, function(err, user) {
            callback(err, doc);
        });
    }); 
};

exports.delcourse = function(courseID, userID, callback) {  // OK
    // 修改教师课程表
    User.update({_id : userID}, {$pull : {'course' : courseID}},
                        function(err, doc) {
        if (!err && doc && doc.ok == 1) {
            // 删除课程
            delcourseonly(courseID, callback);
        } else {
            console.log('teacher ' + userID + " does not have course " + courseID);
            callback('delcourse error!', null);   // 该老师不教此门课，请自定义callback返回值
        }
    });
};

exports.addexam = function(exam, courseID, callback) {  // OK
    var exam_ = new Exam(exam);
    exam_.save(function(err, doc) {
        if (!err && doc) {
            Course.update({_id: courseID}, 
                {$push : {'exam' : {'name':exam.name, '_id': doc.id}}}, 
                callback);  // callback返回Course修改情况
        }
    });
};

exports.delexam = function(examID, courseID, callback) {
    Course.update({_id : courseID}, {$pull : {'exam' : {'id': examID}}}, function(err, doc) {
        if (!err && doc.ok == 1) {
            // 删除试卷
            delexamonly(examID, function(err, doc) {});
        } else {
            console.log('course ' + courseID +' does not have exam ' + examID);
            // 该课程没此份试卷，自定义返回err
            callback('exam not found', null);
        }
    });
};

var delcourseonly = function(courseID, callback) {      // OK
    console.log('delete course ' + courseID + ' begin');
    var promise = Course.findById(courseID).exec();
    var examarr = new Array;
    promise.then(function(doc) {
        // 若课程存在且有相应试卷，删试卷
        if (doc && doc.exam) {
            for (var i = 0; i < doc.exam.length; ++i) {
                examarr.push(delexamonly(doc.exam[i]._id, function(err, doc){}));
            }
        }
    });

    Promise.all(examarr).then(function(doc) {
        // 删课程
        Course.remove({_id: courseID}, function(err, doc) {
            if (doc && doc.result.ok == 1) {
                console.log('delete course success!');
            } else {
                console.log("can't find the course!");
            }
            callback(null, doc);
        });
    }).catch (function(err) {
        console.log('delete course failure!');
        console.log(err);
        callback(err, null);
    });
};

var delexamonly = function(examID, callback) {  // OK
    return Exam.remove({_id : examID}).exec(function(err, doc) {
        if (err) {
            console.log('delete exam ' + examID + ' failure!');
            console.log(err);
        } else if (doc && doc.result.ok == 1) {
            console.log('delete exam ' + examID + ' success!');
        } else {
            console.log("can't find the exam " + examID);
        }
        callback(err, doc);
    });
};
