const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const random = require("./modules/random");
const jwt = require('jsonwebtoken');

require('dotenv').config(); // loading .env config files
// database connection start
var mysql      = require('mysql2');

var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
	port		 : process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
	insecureAuth : true,
	database: process.env.DB_SCHE,
});

var database_connection = null;

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  } 
	database_connection = connection;
  console.log('connected as id ' + connection.threadId);
});
// database connection end


const index = require('./routes/index');
const v1api  = require("./routes/api");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.disable('x-powered-by');

app.use( (req, res, next)=>{
	res.database = database_connection;
	next();
} );

app.use(helmet.hsts({
  maxAge: 1234000,
  setIf: function (req, res) {
    return req.secure || (req.headers['x-forwarded-proto'] === 'https')
  }
}));


app.use(helmet.hsts({
  maxAge: 1234000,
  force: true
}))
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
	secret:random( { length:256 } ), 
	cookie:{maxAge: 24 * 60 * 60 * 1000},
	path:'/tmp'
}));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1', v1api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
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
