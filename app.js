var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./controllers/config.js');

var index = require('./routes/index');
var home = require('./routes/home');
var signin = require('./routes/signin');
var exam = require('./routes/exam');
var course = require('./routes/course');
var student = require('./routes/student');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (config.app.accesslog) {
  app.use(logger(config.app.accesslog));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(config.app.session));

app.use('/', index);
app.use('/', student)
app.use('/', home);
app.use('/signin', signin);
app.use('/exam', exam);
app.use('/course', course);
app.use('/docs', express.static(__dirname + '/docs'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('找不到该页面');
  err.status = 404;
  err.stack = JSON.stringify({
    message: 'No route for url ' + req.url,
    headers: req.rawHeaders
  });
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  err.status = err.status || 500;
  if (err.status.toString().match(config.app.errorlog)) {
    console.error(err);
  }

  if (config.app.debug) {
    res.locals.debug = true;
  } else if (err.status >= 500) {
    err.message = '服务器错误';
  }

  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

module.exports = app;
