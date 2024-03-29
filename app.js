var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPI = require('./routes/testAPI');
var profile = require('./routes/profile/posts');
var friends = require('./routes/profile/friends');
var messages = require('./routes/profile/messages');
var posts = require('./routes/postrelated/posts');
var login = require('./routes/auth/login');
var forgotpassword = require('./routes/auth/forgotpassword');
var resetpassword = require('./routes/auth/resetpassword');
var signup = require('./routes/auth/signup');
var messages = require('./routes/profile/messages');
var reservations = require('./routes/postrelated/reservation')
const bodyParser = require("body-parser");

var app = express();
app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(bodyParser.json({
  extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPI);
app.use('/posts', posts);
app.use('/profile', profile);
app.use('/friends', friends);
app.use('/login', login);
app.use('/signup', signup);
app.use('/forgotpassword', forgotpassword);
app.use('/resetpassword', resetpassword)
app.use('/reservations', reservations);
app.use('/messages', messages);

app.use(bodyParser.json({
  extended: true
}));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
if(process.env.STATUS !== "production"){
  var server = app.listen(8080, function() {
    console.log('Ready on port %d', server.address().port);
  });}
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
