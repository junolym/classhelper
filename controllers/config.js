var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');

var config = yaml.load(fs.readFileSync(path.join(__dirname, '../config.yml'), 'utf8'));

// check MySQL connection
var mysql      = require('mysql');
var connection = mysql.createConnection(config.sql);
connection.connect(err => {
    if (err) {
        console.error('连接MySQL数据库失败，请检查config.yml中sql部分');
        throw(err);
    }
});
connection.end();

// check mailer
if (config.user.verifyemail || config.user.resetpassword) {
    var transporter = nodemailer.createTransport(config.smtp);
    transporter.verify(function(err) {
        if (err) {
            console.log('SMTP服务连接失败，请检查配置文件');
            throw(err);
        }
    });
}

module.exports = config;