var express = require('express');
var router = express.Router();

// Render the full gallery
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

// Redirect back to gallery if there is no image ID
router.get('/image', function(req, res){
	res.redirect('/gallery');
});

// Render the single image page
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
			} else if(image[0] == undefined) {
				// 404 is image does not exist
					// To add : Really check if image is available on Filestorage
				var message = "404: Image is not available";
				var data = { req: req, message: message }
				res.render('gallery/image.ejs', data);
			} else{
				console.log(image);
				var message = null;
				var data = { req: req, message: message, images: image }
				res.render('gallery/image.ejs', data);
			}
		});
	});
});

module.exports = router;