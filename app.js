const express = require('express');
const morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.js');
const postRouter = require('./routes/postRoutes');
const router = require('./routes/routes');

//initialise for comment feature
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '1565426',
  key: '100c97a2a597d4ced484',
  secret: '31f44ab12469d7b10481',
  cluster: 'us2',
  encrypted: true
});

const app = express();

//specify folder with static resources
app.use(express.static('resources/'));

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
//app.use('/api/v1/posts', postRouter);
app.use('/', router);
app.use('/search', router);
app.use('/post', router);
app.use('/createPost', router);
//app.use('/api/v1/users', userRouter);



app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalurl} on this server`
  // });
  const err = new Error(`Can't find ${req.originalurl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});



//middleware -> error handling
//app.use(globalErrorHandler);

//comment feature
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Error Handler for 404 Pages
app.use(function(req, res, next) {
  var error404 = new Error('Route Not Found');
  error404.status = 404;
  next(error404);
});

module.exports = app;

