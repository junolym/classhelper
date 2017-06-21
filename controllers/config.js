var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');

var config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config.yml'), 'utf8'));

// TODO
// check config and merge default config

module.exports = config;