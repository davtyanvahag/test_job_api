var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const { Sequelize } = require('sequelize');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var filesRouter = require('./routes/files');
const ENV = require('dotenv').config({path: __dirname + '/.env'});
var cors = require('cors');


const sequelize = new Sequelize(ENV.parsed.DB_NAME, ENV.parsed.DB_USER, ENV.parsed.DB_PASSWORD, {
  host: ENV.parsed.DB_HOST,
  port: ENV.parsed.DB_PASSWORD,
  dialect: 'mysql'
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const whitelist = ENV.parsed.ORIGINS;
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

app.use(cors());
app.use(function(req, res, next) {
  const allowedOrigins = ENV.parsed.ORIGIN;
  const origin = req.headers.origin && typeof req.headers.origin !== 'undefined' ? req.headers.origin : req.headers.host;
  // if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Accept-Language', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type, image/jpeg, image/jpg, image/png, application/pdf');
    return next();
  // } else {
  //   res.send({error: 'Not allowed by CORS'});
  // }

});

app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/files', filesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
