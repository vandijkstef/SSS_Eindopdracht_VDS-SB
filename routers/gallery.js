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
	      		var message = "Testbericht";
				var data = { req: req, res: res, message: message, images: gallery }
				displayImg(data, req, res);
	      	}
      	});
	});
});

// Redirect back to gallery if there is no image ID
router.get('/image', function(req, res){
	res.redirect('/gallery');
});


// Render the single image page
router.get('/image/:id', function(req, res){
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
				var sql = 'SELECT * FROM comments WHERE photo_id = ' + imageId;
				console.log(sql);
				connection.query(sql, function(err, comments){
					console.log(comments);
					console.log(image);
					var message = null;
					var data = { req: req, message: message, images: image, comments: comments }
					res.render('gallery/image.ejs', data);
				})
			}
		});
	});
});

router.post('/image/:id', function(req, res){
	req.getConnection(function(err, connection){
		// Get all vars
		console.log(req.body);
		var imageId = req.param("id");
		var comment = req.body.comment;
		var username = req.body.username;
		var is_user = 0;
		// Validate
		if (comment == undefined || comment.length < 5) {
			var message = "Comment too short";
			var data = { req: req, message: message }
			res.render('gallery/image.ejs', data);
			return
		}
		if (username == undefined) {
			username = 'anonymous';
		}
		var sql = 'INSERT INTO comments (photo_id, created_at, comment, username, is_user) VALUES (' + imageId + ',"' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '","' + comment + '", "' + username + '",' + is_user + ')';
		console.log(sql);
		connection.query(sql, function(err, comments){
			if(err) {
	      		var message = "Database Error" + err;
				var data = { req: req, message: message }
				res.render('gallery/index.ejs', data);
	      	} else {
	      		var message = "Comment Inserted";
				var data = { req: req, message: message }
				res.render('gallery/image.ejs', data);
	      	}
		});
	});
});

// Function should
// - Display Imagegallery
// - Display specific image if provided with imageId
// - Display message (in case of post)
var displayImg = function (data, imageId, message) {
	var mode = "gallery";
	var sql = "";
	req = data.req;
	res = data.res;
	if (imageId >= 0 ) {
		mode = "single";
	}
	if (mode == "gallery") {
		sql = 'SELECT photos.*, users.name AS username FROM photos LEFT JOIN users ON photos.user_id = users.id';
		data.title = "Gallery";
	} else if (mode == "single" ) {
		sql = 'SELECT photos.*, users.name AS username FROM photos LEFT JOIN users ON photos.user_id = users.id WHERE photos.id = ' + imageId + 'LIMIT 1';
	}
	req.getConnection(function(err, connection){
		if (err) {
			res.send(err);
			console.log(err);
		} else {
			connection.query(sql, function(err, imagearray) {
				if (err) {
					res.send(err);
					console.log(err);
				} else {
					data.images = imagearray;
					if (mode == "single") {
						data.title = data.images[0].caption;
					}
					//data.message = "testmessage";
					res.render('gallery/index.ejs', data);
				}
			})
		}
	})
};

module.exports = router;