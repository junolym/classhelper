var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');
var mysql      = require('mysql');
var request = require('request');

var config = yaml.load(fs.readFileSync(
    path.join(__dirname, '../config.yml'), 'utf8'));
// running variable
config.var = {};

// check MySQL connection
var connection = mysql.createConnection(config.sql);
connection.connect(err => {
    if (err) {
        console.error('MySQL server connect failed, server can not work');
        console.error('Please check the mysql in config.yml');
        console.error('连接MySQL数据库失败，系统无法运行')
        console.error('请检查配置文件中mysql部分');
        throw(err);
    }
});
connection.end();

// check outer url
request(config.server.host + '/testconnection', (error, response, body) => {
    if (!error && body == config.var.serverHash) {
        console.log('Global url:', config.server.host);
    } else {
        console.warn('Global url check failed, outer visit will not success');
        console.warn('Please check the server.host in config.yml');
        console.warn('全局网址检查失败，外部访问将无法成功')
        console.warn('请检查配置文件中的server.host设置');
    }
})

// check mailer
if (config.user.verifyemail || config.user.resetpassword) {
    var transporter = nodemailer.createTransport(config.smtp);
    transporter.verify(function(err) {
        if (err) {
            console.error('SMTP check failed, email can not be sent');
            console.error('Please check the smtp',
                'or close verifyemail and resetpassword in config.yml');
            console.error('SMTP服务连接失败，将无法发送邮件');
            console.error('请检查配置文件中smtp的设置，或关闭邮箱验证及重置密码功能');
            throw(err);
        }
    });
}

module.exports = config;
