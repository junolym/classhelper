var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');

var config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config.yml'), 'utf8'));

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

module.exports = config;