var dao = require('../dao/dao.js');
var UserError = dao.UserError;
var helper = require('./route-helper.js');
var config = require('./config.js');

UserManager = {
    register: register,
    resetpassword: resetpassword
};

function register(username, password, email) {
    if (email.match(config.user.allowemail)) {
        if (config.user.verifyemail) {
            // send email
            return Promise.resolve('请查收邮件，完成注册');
        } else {
            // dao add user
            return Promise.resolve('用户注册成功<br><br><a href="/login">立即登录</a>');
        }
    } else {
        return Promise.reject(new UserError('该邮箱地址不允许注册账户, 请联系管理员'));
    }
}

function resetpassword(username, email) {
    if (config.user.resetpassword) {
        // send email
        return Promise.resolve('请查收邮件，完成密码重置');
    } else {
        return Promise.reject(new UserError('系统不允许重置密码, 请联系管理员'));
    }
}

module.exports = UserManager;
