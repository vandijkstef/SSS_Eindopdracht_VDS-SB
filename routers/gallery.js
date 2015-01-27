var express = require('express');
var router = express.Router();

// Get custom functions
var vds = require('../vds.js');

// Render the full gallery
router.get('/', function(req, res){
	var data = { req: req, res: res }
	vds.displayImg(data);
});

// Redirect back to gallery if there is no image ID
router.get('/image', function(req, res){
	res.redirect('/gallery');
});


// Render the single image page
router.get('/image/:id', function(req, res){
	var imageId = req.param("id");
	var data = { req: req, res: res }
	vds.displayImg(data, imageId);
});

// Process the comment form
router.post('/image/:id', function(req, res){
	req.getConnection(function(err, connection){
		// Get all vars
		var imageId = req.param("id");
		var comment = req.body.comment;
		var username = req.body.username;
		var is_user = 0; // To be done - Check if user is a logged in user
		// Validate
		if (comment == undefined || comment.length < 5) {
			var message = "Comment too short";
			var data = { req: req, res: res, message: message }
			displayImg(data, imageId);
			return
		}
		// Set username to anonymous
		if (username == undefined) {
			username = 'anonymous';
		}
		// Check if the comment is not double
		var sql = 'SELECT * FROM comments WHERE comment = "' + comment + '" AND username = "' + username + '" AND photo_id = "' + imageId + '"';
		connection.query(sql, function(err, doublecomment){
			if (doublecomment.length >= 1) {
				var message = "Comment exsists - A bit trigger happy?";
				var data = { req: req, res: res, message: message }
				vds.displayImg(data, imageId);
				return
			} else {	
				// Insert the comment
				var sql2 = 'INSERT INTO comments (photo_id, created_at, comment, username, is_user) VALUES (' + imageId + ',"' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '","' + comment + '", "' + username + '",' + is_user + ')';
				connection.query(sql2, function(err, comments){
					if(err) {
			      		var message = "Database Error: " + err;
						var data = { req: req, res: res, message: message }
						vds.displayImg(data, imageId);
			      	} else {
			      		var message = "Comment Inserted";
						var data = { req: req, res: res, message: message }
						vds.displayImg(data, imageId);
			      	}
				});	
			}
		})
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



module.exports = router;