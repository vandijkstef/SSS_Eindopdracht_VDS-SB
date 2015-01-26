var express = require('express');
var router = express.Router();
var fs = require('fs');

// REDIRECT TO LOGIN IF USER IS NOT LOGGED IN
// WITH ERROR MESSAGE SAYING YOU CAN'T UPLOAD PHOTOS

router.get('/', function(req, res){
	// Only allow logged in users
	if(req.session.userId) {
		var title = "Upload Photo";
		var data = { req: req, title: title }
		res.render('upload/index.ejs', data);
		console.log(req.session);
	} else {
		// Or send them to the gallery
		console.log(req.session);
		res.redirect('/gallery');
	}
});

router.post('/', function(req, res){
	// Processing if upload succeeded
	if(uploadFlag == true) {
		req.getConnection(function(err, connection){
			var sql = 'INSERT INTO photos (user_id, caption, filename) VALUES (' + req.session.userId + ',"' + req.body.caption + '","' + req.files.imagefile.name + '")';
			console.log(sql);
		    connection.query(sql, function(err){
		      	if(err) {
		      		console.log("SQL Error");
		      		return;
		      	} else {
		      		var message = "Image upload Succes!";
					var data = {req:req, message:message}
					res.render('upload/index.ejs', data);
		      	}
	      	})
		})
	}
	// Processing if upload was not an image
	if(uploadFlag == false) {
		var message = "The file uploaded is not an image";
		var data = {req:req, message:message}
		res.render('upload/index.ejs', data);
	}	
});

module.exports = router;