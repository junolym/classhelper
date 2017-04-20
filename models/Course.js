var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Course = mongoose.model('Course', new Schema({
    name: {
        type: String,
        required: true
    },
    time: String,
    student: [{
        stu_id: Number,
        name: String
    }],
    exam: [{
        name: String,
        _id: {
            type: ObjectId,
            re: 'Exam'
        }
    }],
    check: [{
        date: Date,
        student: [{}]
    }]
}));

module.exports = Course;
