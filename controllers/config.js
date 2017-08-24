const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const request = require('request');

const config = yaml.load(fs.readFileSync(
  path.join(__dirname, '../config.yml'), 'utf8'));
// running variable
config.var = {};

// check MySQL connection
const connection = mysql.createConnection(config.sql);
connection.connect((err) => {
  if (err) {
    console.error(`ERROR:
      MySQL server connect failed, server can not work
      Please check the mysql in config.yml
      连接MySQL数据库失败，系统无法启动
      请检查配置文件中mysql部分
    `);
    throw (err);
  }
});
connection.end();

// check outer url
request(`${config.server.host}/testconnection`, (error, response, body) => {
  if (!error && body === config.var.serverHash) {
    console.log(`INFO:
      Global url checked
      全局链接检查通过
      ${config.server.host}
    `);
  } else {
    console.warn(`WARNING:
      Global url check failed, outer visit will not success
      Please check the server.host in config.yml
      全局网址检查失败，外部访问将无法成功
      请检查配置文件中的server.host设置
    `);
  }
});

// check mailer
if (config.user.verifyemail || config.user.resetpassword) {
  const transporter = nodemailer.createTransport(config.smtp);
  transporter.verify((err) => {
    if (err) {
      console.error(`ERROR:
        SMTP check failed, email can not be sent
        Please check the smtp or disable verifyemail and resetpassword
        SMTP服务连接失败，将无法发送邮件
        请检查配置文件中smtp的设置，或关闭邮箱验证及重置密码功能
      `);
      throw (err);
    }
  });
}

module.exports = config;
