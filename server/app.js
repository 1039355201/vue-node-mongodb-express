var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置登陆拦截
app.use(function (req, res, next) {
  // console.log(req.path, req.originalUrl, req.cookies);
  if (req.cookies.userId) {
    next();
  } else {
    //console.log(1)
    // 登录拦截 用cookie验证 如果cookie值是空的话，（用户未登录）设置白名单，拦截加入购物车等功能
    if (req.originalUrl == '/users/login' || req.originalUrl == '/users/loginout' || req.path == '/goods/list' || req.path == 'goods/searchGoods' || req.originalUrl == '/users/register') {
      //console.log(2)
      next(); //req.originalUrl路径包含请求的查询字符串，req.path只是请求的路径，不包括请求的字符串
    } else {
      // res.status(200).json({
      // 	code:3,
      // 	msg:"当前未登录！"
      // })
      res.json({
        status: '10001',
        code: 3,
        msg: "当前未登录！"
      })
    }
  }
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

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
