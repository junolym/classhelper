var mongoose = require('mongoose');
var User = require('./User.js');
var Course = require('./Course.js');
var Exam = require('./Exam.js');

// callback(err, doc)
exports.getuserbyname = function(username, callback) {  // OK
    User.findOne({user: username}).exec(callback);
};

// callback(err, doc)
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

// callback(err, doc)
// if OK                doc == 0
// if user not exist    doc == 1
exports.deluser = function(userID, callback) {
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
            if (doc && doc.result.n == 1) {
                console.log('delete user ' + userID + ' success!');
                callback(null, 0);
            } else {
                console.log('delete user ' + userID + ' failure!');
                callback(null, 1);
            }
        });
    }).catch(function(err) {
        console.log('delete user failure!');
        console.log(err);
        callback(err, null);
    });
};

// callback(err, doc)
exports.getcourse = function(courseID, callback) {
    Course.findById(courseID).exec(callback);
};

// callback(err, doc)
// if OK                doc == course
// if user not exist    doc == 1
exports.addcourse = function(course, userID, callback) {    // OK
    var course_ = new Course(course);

    // 添加课程
    course_.save(function(err, doc) {
        // 修改教师的课程表
        User.update({_id : userID}, {$push: {'course' : doc.id}}, function(err, updatedoc) {
            if (!err && updatedoc.n == 1) {
                console.log('add course ' + doc.id + ' success!');
                callback(err, doc);
            } else {
                // 修改课程表失败，删除课程
                console.log('add course ' + doc.id + ' failure!');
                Course.remove({_id : doc.id}, function(err, doc){});
                callback(err, 1);
            }
        });
    }); 
};

// callback(err, doc)
// if OK                                    doc == 0
// if course not exist                      doc == 1
// if teacher does not have this course     doc == 2
exports.delcourse = function(courseID, userID, callback) {  // OK
    // 修改教师课程表
    User.update({_id : userID}, {$pull : {'course' : courseID}},
                        function(err, doc) {
        if (!err && doc && doc.n == 1) {
            // 删除课程
            delcourseonly(courseID, callback);
        } else {
            console.log('teacher ' + userID + " does not have course " + courseID);
            callback(err, 2);   // 该老师不教此门课，请自定义callback返回值
        }
    });
};


// callback(err, doc)
// if OK                doc == exam
// if course not exit   doc == 1
exports.addexam = function(exam, courseID, callback) {  // OK
    var exam_ = new Exam(exam);
    exam_.save(function(err, doc) {
        Course.update({_id: courseID}, 
            {$push : {'exam' : {'name':exam.name, '_id': doc.id}}}, 
                function(err, updatedoc) {
                if (!err && updatedoc.n == 1) {
                    console.log('add exam ' + doc.id + ' success!');
                    callback(err, doc);
                } else {
                    console.log('add exam ' + doc.id + ' failure!');
                    Exam.remove({_id : doc.id}, function(err, doc){});
                    callback(err, 1);
                }
        }); 
    });
};

// callback(err, doc)
// if OK                            doc == 0
// if exam not exist                doc == 1
// if the course without this exam  doc == 2
exports.delexam = function(examID, courseID, callback) {
    Course.update({_id : courseID}, {$pull : {'exam' : {'id': examID}}}, function(err, doc) {
        if (!err && doc.n == 1) {
            // 删除试卷
            delexamonly(examID, callback);
        } else {
            console.log('course ' + courseID +' does not have exam ' + examID);
            callback(err, 2);
        }
    });
};

// callback(err, doc)
// if OK                    doc == 0
// if course not exist      doc == 1
var delcourseonly = function(courseID, callback) {      // OK
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
            if (doc && doc.result.n == 1) {
                console.log('delete course ' + courseID+  ' success!');
                callback(err, 0);
            } else {
                console.log("can't find the course: " + courseID + " !");
                callback(err, 1);
            }
        });
    }).catch (function(err) {
        console.log('delete course failure!');
        console.log(err);
        callback(err, null);
    });
};

// callback(err, doc)
// if OK                doc == 0
// if exam not exist    doc == 1
var delexamonly = function(examID, callback) {  // OK
    return Exam.remove({_id : examID}).exec(function(err, doc) {
        if (err) {
            console.log('delete exam ' + examID + ' failure!');
            console.log(err);
            callback(err, null);
        } else if (doc && doc.result.n == 1) {
            console.log('delete exam ' + examID + ' success!');
            callback(err, 0);
        } else {
            console.log("can't find the exam " + examID);
            callback(err, 1);
        }
    });
};
