var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	req.getConnection(function(err, connection){
		var sql = 'SELECT photos.*, users.name AS username FROM photos LEFT JOIN users ON photos.user_id = users.id';
		console.log(sql);
	    connection.query(sql, function(err, gallery){
	      	if(err) {
	      		var message = "Database Error" + err;
				var data = { req: req, message: message }
				res.render('gallery/index.ejs', data);
	      	} else {
	      		console.log(gallery);
	      		var message = null;
				var data = { req: req, message: message, images: gallery }
				res.render('gallery/index.ejs', data);
	      	}
      	});
	});
});

router.get('/image', function(req, res){
	// Redirect back to gallery if there is no image ID
	res.redirect('/gallery');
});

router.get('/image/:id', function(req,res){
	var imageId = req.param("id");
	console.log(imageId);
	req.getConnection(function(err, connection){
		var sql = 'SELECT photos.*, users.name AS username FROM photos LEFT JOIN users ON photos.user_id = users.id WHERE photos.id = ' + imageId;
		console.log(sql);
		connection.query(sql, function(err, image){
			if(err) {
				var message = "Database Error" + err;
				var data = { req: req, message: message }
				res.render('gallery/image.ejs', data);
			} else {
				console.log(image[0]);
				var message = null;
				var data = { req: req, message: message, image: image[0] }
				res.render('gallery/image.ejs', data);
			}
		});
	});
});

module.exports = router;