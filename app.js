var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dbConnection = require('./database');
const cookieSession = require('cookie-session');
var UserModel= require("./models/User");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRout = require('./routes/register');

/* *********** ADMIN ROUTES *********** */

var adminRout = require('./routes/admin/user-auth');
var dashboardRout = require('./routes/admin/dashboard');
var logoutRout = require('./routes/admin/logout');
var productRout = require('./routes/admin/products-listing');
var productcatRout = require('./routes/admin/product-categories');

/* *********** ADMIN ROUTES *********** */

var app = express();
var server = http.createServer(app);
//var routes =  require('./routes');


server.listen(3000);
console.log('Express server started on port %s', server.address().port);
//require('./routes')(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// APPLY COOKIE SESSION MIDDLEWARE
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge:  3600 * 1000 // 1hr
}));

// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
  if(!req.session.isLoggedIn){
      return res.render('pages/index');
  }
  next();
}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRout);
app.use(express.static('public'));
/* ********** Admin *************** */
app.use('/admin', adminRout);
app.use('/dashboard', dashboardRout);
app.use('/logout', logoutRout);

app.use('/admin/product-listing', productRout);
app.use('/admin/product-categories', productcatRout);

/* ********** Admin *************** */

// app.post('/register', function(request, response){
//   console.log(request.body);
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 // next(createError(404));
 var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
   console.error(err);
  // res.status(500).send(); 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

 //render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});


module.exports = app;
