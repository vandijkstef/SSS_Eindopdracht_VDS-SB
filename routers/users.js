var express = require('express');
var router = express.Router();

// Get custom functions
var vds = require('../vds.js');

router.get('/', function(req, res){
  // Only allow logged in users
  if(req.session.userId) {
    var title = "Profile";
    var data = { req: req, title: title }
    res.render('users/profile', data);
  } else {
    // Or render the login
    var title = "Login";
    var data = { req: req, title: title }
    res.render('users/login', data);
  }
});

router.post("/", function(req, res){
  var useremail = req.body.useremail;
  var password = req.body.password;

    req.getConnection(function(err, connection){
    if(err){ next(err); }

    connection.query("SELECT * FROM users WHERE email = ? AND password = ?", [useremail, password], function(err, records){
      if(err){ next(err); }

      if(records.length > 0){
        console.log(req.session);
        req.session.userId = records[0].id;
        req.session.user_lever = records[0].user_level;
        console.log("Logged in! HOORAY", records[0]);
        var message = "Logged in as " + records[0].name;
        var data = { req: req, res: res, message: message }
        vds.displayImg(data);
      } else {
        var data = {
          req: req,
          title: "Login",
          message: "Email adres en/of wachtwoord komen niet overeen."
        }
        res.render("users/login", data);
      }
    });
  });
});

router.get('/signup', function(req, res){
  var title = "Sign up";
  var data = { req: req, title: title }
  res.render('users/signup', data);
});

// checken of email wel echt email is, password lengte aangeven en username lengte. 

router.post('/signup', function(req, res){
  var useremail = req.body.useremail;
  var username = req.body.username;
  var password = req.body.password;

  req.getConnection(function(err, connection){
    if(err) {next(err);}

    var sql = 'SELECT * FROM users WHERE email = "' +useremail + '"';
    console.log(sql);
    connection.query(sql, function(err, records) {
      if(records.length == 0){
        var sql2 = 'SELECT * FROM users WHERE name ="' + username + '"';
        console.log(sql);
        connection.query(sql2, function(err, records){
          if(records.length == 0){
            var sql3 = 'INSERT INTO users (email, name, password, user_level) VALUES("' + useremail + '", "' + username + '", "' + password + '", 1)';
            if(username.length && password.length > 6){
              connection.query(sql3, function(err){
                var useremail = req.body.useremail;
                var password = req.body.password;

                req.getConnection(function(err, connection){
                  if(err){next(err);}

                  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [useremail, password], function(err, records){
                    if(err){next(err);}

                    if(records.length > 0){
                      console.log(req.session);
                      req.session.userId = records[0].id;
                      console.log("You are logged in", records[0]);
                      var message = "Account created as " + records[0].name;
                      var data = { req: req, res: res, message: message }
                      vds.displayImg(data);
                    }
                  })
                })
              })
            } else {
              var message = "You username and password should be longer than 6 characters."
              var data = {
                req: req, 
                message: message,
                title : "Sign up"
              }
              console.log(message);
              res.render('users/signup', data);
            }
          }
        });
      }
    });
  });
});

router.get('/logout', function(req, res){                                 
  // destroy the user's session to log them out                                                                 
  // will be re-created next request 
  req.session.destroy(function(){   
  res.redirect('/users');                                         
});
});


module.exports = router;