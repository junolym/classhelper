var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var User = mongoose.model('User', new mongoose.Schema({
    user: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    mode: {
        type: Number,
        default: 1
    }, // 0: root  1:normal
    name: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    course: [{
        type: ObjectId,
        ref: 'Course'
    }]
}));

module.exports = User;
