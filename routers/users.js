var express = require('express');
var router = express.Router();

// Moet redirecten naar gallery of profile
// router.get("/welcome", function(req, res, next){
//   res.render("users/welcome");
// });

router.get('/', function(req, res){
  // If logged in -> Show profile?
  // Else show login form
  var data = {
    req: req,
    error: null
  }
  res.render('users/login', {title: 'login', req: req});
});

// Waarom post naar /login? Je kan toch posten naar /user, oftwel "/"??
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
        console.log(req.session);
        console.log(records[0]);
        req.session.userId = records[0].id;
        req.session.username = records[0].name;
        req.session.user_lever = records[0].user_level;
        console.log("Logged in! HOORAY", req.session);
        res.render("users/welcome", {user: records[0]});
      } else {
        var data = {
          req: req,
          // gebruik "message" ipv "error", die zet ik in de head
          error: "Email adres en/of wachtwoord komen niet overeen."
        }
        res.render("users/login", data);
      }
    });
  });
});




module.exports = router;