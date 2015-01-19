var express = require('express');
var router = express.Router();

router.get("/welcome", function(req, res, next){
  res.render("users/welcome");
});

router.get('/', function(req, res){
  var data = {
    req: req,
    error: null
  }
  res.render('users/login', {title: 'login', req: req});
});

router.post("/login", function(req, res){
  var username = req.body.username;
    // Check if username is in DB
  var password = req.body.password;
    // Check if this password is the same as in database for this User

    req.getConnection(function(err, connection){
    if(err){ next(err); }

    connection.query("SELECT * FROM users WHERE email = ? AND password = ?", [username, password], function(err, records){
      if(err){ next(err); }

      if(records.length > 0){
        req.session.userId = records[0].id;
        console.log("Logged in! HOORAY", records[0]);
        res.render("users/welcome", {user: records[0]});
      } else {
        var data = {
          req: req,
          error: "Email adres en/of wachtwoord komen niet overeen."
        }
        res.render("users/login", data);
      }
    });

  });
});




module.exports = router;