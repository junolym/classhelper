var dao = require('../dao/dao.js');
var UserError = dao.UserError;
var helper = require('./route-helper.js');
var config = require('./config.js');
var path = require('path');
var nodemailer = require('nodemailer');
var keyManager = require('./key-manager');
var hbs = require('nodemailer-express-handlebars');

UserManager = {
    register: register,
    resetpassword: resetpassword
};

function register(username, password, email) {
    if (!email.match(config.user.allowemail)) {
        return Promise.reject(new UserError('该邮箱地址不允许注册账户, 请联系管理员'));
    }
    return dao.checkuser(username).then(() => {
        return dao.checkemail(email);
    }).then(() => {
        if (config.user.verifyemail) {
            var code = keyManager.add({
                username: username,
                password: password,
                email: email,
                register: true
            }, {
                maxAge: 30*60*1000, // 30 mins
                length: 8
            });
            sendMail(email, 'register', '/register?code=' + code);
            return Promise.resolve('请查收邮件，完成注册');
        }
        return dao.adduser(username, password, username, email, '').then(() => {
            return Promise.resolve('注册成功');
        });
    });
}

function resetpassword(username, email) {
    if (!config.user.resetpassword) {
        return Promise.reject(new UserError('系统不允许重置密码, 请联系管理员'));
    }
    return dao.verifyemail(username, email).then(() => {
        var code = keyManager.add({
            username: username,
            email: email,
            resetpassword: true
        }, {
            maxAge: 30*60*1000, // 30 mins
            length: 8
        });
        sendMail(email, 'resetpassword', '/resetpassword?code=' + code);
        return Promise.resolve('请查收邮件，完成密码重置');
    });
}

function sendMail(email, type, url) {
    var subjects = {
        'register': 'Classhelper注册验证',
        'resetpassword': 'Classhelper密码找回'
    }

    var transporter = nodemailer.createTransport(config.smtp);
    transporter.use('compile', hbs({
        viewPath: path.join(__dirname, '../views/email'),
        extName: '.hbs'
    }));

    transporter.sendMail({
        from: 'Classhelper<' + config.smtp.auth.user + '>',
        to: email,
        subject: subjects[type],
        template: type,
        context: {
           url: config.server.host + url
        }
    }, (err, response) => {
        if (err) {
            return console.error(err);
        }
        console.log('Mail sent to', email);
    });
}

module.exports = UserManager;
