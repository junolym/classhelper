var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var User = mongoose.model('User', new Schema({
    user: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    mode: Number, // 0: root  1:normal
    name: {
        type: String,
        required: true
    },

    email: String,
    phone: String,
    course: [ {
        type: ObjectId,
        ref: Course
    }]
}));

var Course = mongoose.model('Course', new Schema({
    name: {
        type: String,
        required: true
    },
    time: String,
    student: [{
        id: Number,
        name: String
    }],
    exam: [{
        name: String,
        id: {
            type: ObjectId,
            ref: Exam
        }
    }]
}));


var Exam = mongoose.model('Exam', new Schema({
    name: String,
    state: Number, // 0: 1: 2:
    time: Date,     // 出卷时间：结束时间
    question: [{
        any:Schema.Types.Mixed
    }]
}));

module.exports = User;
module.exports = Course;
module.exports = Exam;


