var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  // Only allow logged in users
  if(req.session.userId) {
    var data = { req: req }
    res.render('users/profile', data);
  } else {
    // Or send them to the gallery
    var data = { req: req}
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
        var data = {
          req: req,
          user: records[0]
        }
        res.redirect('/gallery');
      } else {
        var data = {
          req: req,
          message: "Email adres en/of wachtwoord komen niet overeen."
        }
        res.render("users/login", data);
      }
    });
  });
});

router.get('/signup', function(req, res){
  var data = { req: req}
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
        var sql = 'SELECT * FROM users WHERE name ="' + username + '"';
        console.log(sql);
        connection.query(sql, function(err){
          if(records.length == 0){
            var sql = 'INSERT INTO users (email, name, password) VALUES("' + useremail + '", "' + username + '", "' + password + '")';
            if(username.length && password.length > 6){
              connection.query(sql, function(err){
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
                      var data = {
                        req: req,
                        user: records[0]
                      }
                      res.redirect("/gallery")
                    }
                  })
                })
              })
            } else {
              var message = "You username and password should be longer than 6 characters."
              var data = {
                req: req, 
                message: message
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