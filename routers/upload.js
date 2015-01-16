var express = require('express');
var router = express.Router();
var fs = require('fs');

// REDIRECT TO LOGIN IF USER IS NOT LOGGED IN
// WITH ERROR MESSAGE SAYING YOU CAN'T UPLOAD PHOTOS

router.get('/', function(req, res){
	var data = { req: req }
	res.render('upload/index.ejs', data);
});

router.post('/', function(req, res){
	var imageCaption = req.body.caption;
	var imageTest = imageFile.match(/\.(jpg|jpeg|png|gif)$/);
	// If file is not an image - Show error message to user
	if (imageTest == null) {
		var message = "Uploaded file is not an image";
		var data = {req:req, message:message}
		res.render('upload/index.ejs', data);
		return;
	} else {
		// Assumed the file in an image
		req.getConnection(function(err, connection){
		    if(err){ return next(err); }
		    // Check if image already exists
		    var sql = 'SELECT filename FROM photos WHERE filename = "' + imageFile + '"';
		    connection.query(sql, function(err, images){
		      	if(err){ return next(err); }
		      	// Add processing if image is already uploaded here
		      	if(images.length > 0) {
		      		// Imagename is already in database
		      		var message = "Image already in database";
					var data = {req:req, message:message}
					res.render('upload/index.ejs', data);
					return;
		      	} else {
		      		// We can process the form now
		      		// Add image to Filesystem
		      		// var upload = req.files;
    				// console.log(upload);
    				// fs.readFile(req.files.imageFile.path, function(err,data) {
    				// 	fs.writeFile(imageFile, data, function(err){
			     	//  		if(!err){
			     	//  		console.log("Written file:" + imageFile + " in the ");
			     	//  			}
			     	//  		})
    				// })
		      		
		      		console.log("File written?"); // Output's before Surely Written due to Async
			      	// Add image to Database

			      	// If everything went ok - Show succes message to user
			      	var message = "Image is uploaded";
					var data = {req:req, message:message}
					res.render('upload/index.ejs', data);
					return;
		      	}		      	
	    	});
	  	});
		return;
	}

	
	
		// If so, ask user if image if the same
			// If not --> Change name and...

	// Add image to Filesystem

	// Add image to Database

	// Redirect user
		// Add confirm (with URL?)
	res.redirect(req.baseUrl);
});

module.exports = router;