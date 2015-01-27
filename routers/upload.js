var express = require('express');
var router = express.Router();
var fs = require('fs');

// Get custom functions
var vds = require('../vds.js');

// REDIRECT TO LOGIN IF USER IS NOT LOGGED IN
// WITH ERROR MESSAGE SAYING YOU CAN'T UPLOAD PHOTOS

router.get('/', function(req, res){
	// Only allow logged in users
	if(req.session.userId) {
		var title = "Upload Photo";
		var data = { req: req, title: title }
		res.render('upload/index.ejs', data);
	} else {
		// Or send them to the gallery
		res.redirect('/gallery');
	}
});

router.post('/', function(req, res){
	// Processing if upload succeeded
	if(uploadFlag == true) {
		req.getConnection(function(err, connection){
			var sql = 'INSERT INTO photos (user_id, caption, filename) VALUES (' + req.session.userId + ',"' + req.body.caption + '","' + req.files.imagefile.name + '")';
		    connection.query(sql, function(err){
		      	if(err) {
		      		console.log("SQL Error");
		      		return;
		      	} else {
		      		console.log(req.files);
		      		var sql2 = 'SELECT * FROM photos WHERE user_id = "' + req.session.userId + '" AND filename = "' + req.files.imagefile.name + '"';
		      		connection.query(sql2, function(err, uploadedimage) {
		      			if (err) {
		      				res.render(err);
		      				console.log(err);
		      			} else {
		      				var imageId = uploadedimage[0].id;
		      				var message = "Image upload Succes!";
							var data = { req: req, res: res, message: message }
							vds.displayImg(data, imageId);
		      			}
		      		})
		      		
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