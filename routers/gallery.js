var express = require('express');
var router = express.Router();

// Render the full gallery
router.get('/', function(req, res){
	var data = { req: req, res: res }
	displayImg(data);
});

// Redirect back to gallery if there is no image ID
router.get('/image', function(req, res){
	res.redirect('/gallery');
});


// Render the single image page
router.get('/image/:id', function(req, res){
	var imageId = req.param("id");
	var data = { req: req, res: res }
	displayImg(data, imageId);
});

router.post('/image/:id', function(req, res){
	req.getConnection(function(err, connection){
		// Get all vars
		var imageId = req.param("id");
		var comment = req.body.comment;
		var username = req.body.username;
		var is_user = 0;
		// Validate
		if (comment == undefined || comment.length < 5) {
			var message = "Comment too short";
			var data = { req: req, res: res, message: message }
			displayImg(data, imageId);
			return
		}
		if (username == undefined) {
			username = 'anonymous';
		}
		var sql = 'INSERT INTO comments (photo_id, created_at, comment, username, is_user) VALUES (' + imageId + ',"' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '","' + comment + '", "' + username + '",' + is_user + ')';
		connection.query(sql, function(err, comments){
			if(err) {
	      		var message = "Database Error" + err;
				var data = { req: req, res: res, message: message }
				displayImg(data, imageId);
	      	} else {
	      		var message = "Comment Inserted";
				var data = { req: req, res: res, message: message }
				displayImg(data, imageId);
	      	}
		});
	});
});

// Image Display
// - Display Imagegallery
// - Display specific image if provided with imageId
// - Display message
//
// Usage example: 
// 	var message = "Message here";
// 	var data = { req: req, res: res, message: message } // Please give req + res
// 	displayImg(data);
//
// Template takes care of the rest

var displayImg = function (data, imageId) {
	var mode = "gallery"; // Set the mode - Defaults to Gallery
	var sql, sql2; // Create vars
	if (imageId >= 0 ) { 
		mode = "single"; // Set the mode to single if imageId is given
	}
	// Setup the required SQL based on the MODE
	if (mode == "gallery") {
		sql = 'SELECT photos.*, users.name AS username FROM photos LEFT JOIN users ON photos.user_id = users.id';
		data.title = "Gallery";
	} else if (mode == "single" ) {
		sql = 'SELECT photos.*, users.name AS username FROM photos LEFT JOIN users ON photos.user_id = users.id WHERE photos.id = ' + imageId;
		sql2 = 'SELECT * FROM comments WHERE photo_id = ' + imageId;
	}
	// Get the connection and ..
	data.req.getConnection(function(err, connection){
		if (err) {
			res.send(err);
			console.log(err);
		} else {
			// .. execute the SQL queries
			connection.query(sql, function(err, imagearray) {
				if (err) {
					res.send(err);
					console.log(err);
				} else {
					data.images = imagearray;
					// Only for single mode - Get the comments
					if (mode == "single") {
						data.title = data.images[0].caption;
						connection.query(sql2, function(err, commentsarray) {
							if (err) {
								res.send(err);
								console.log(err);
							} else {
								data.comments = commentsarray;
								console.log(data.comments);
								data.res.render('gallery/index.ejs', data); // Render - Waited on SQL
							}
						})
					}
					if (mode == "gallery") {
						data.res.render('gallery/index.ejs', data); // Render - Only full Gallery
					}
				}
			})
		}
	})
};

module.exports = router;