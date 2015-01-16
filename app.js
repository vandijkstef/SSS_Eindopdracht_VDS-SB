var express = require('express');
var path = require('path');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var myConnection = require('express-myconnection');

//  =================
//  = Setup the app =
//  =================

// The app itself
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  ============================
//  = Middleware configuration =
//  ============================

// Setup serving static assets
app.use(express.static(path.join(__dirname, 'public')));

// Add session support
app.use(session({
  secret: 'FowGVvdaO',
  store: new FileStore(),
  saveUninitialized: true,
  resave: false
}));

// Setup bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// Setup Multer
app.use(multer({
  dest: './uploads/',
  onFileUploadStart: function (file) {
    console.log(file.mimetype);
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      return false;
    } else {
      console.log(file.fieldname + ' is starting ...');
    }
  },
  onFileUploadData: function (file, data) {
    console.log(data.length + ' of ' + file.fieldname + ' arrived');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
}));

// Setup MySQL

// Database configuration
var dbOptions = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sss-final'
};

// Add connection middleware
app.use(myConnection(mysql, dbOptions, 'single'));

//  ===========
//  = Routers =
//  ===========
var testRouter = require('./routers/test');
var uploadRouter = require('./routers/upload');


app.use('/test', testRouter);
app.use('/upload', uploadRouter)

// This should be the ONLY route in this file!
app.get('/', function(req, res){
  res.redirect('/test');
});

//  =================
//  = Start the app =
//  =================

app.listen(3000, function(){
  console.log('App listening at http://localhost:3000');
});