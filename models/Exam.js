var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Exam = mongoose.model('Exam', new Schema({
    name: String,
    state: Number, // 0: 1: 2:
    time: Date,     // 出卷时间：结束时间
    question: [{}],
    answer: [{}],
    statistics: [{}]
}));

module.exports = Exam;
