var express = require('express');
var router = express.Router();
//var fs = require('fs');

// REDIRECT TO LOGIN IF USER IS NOT LOGGED IN
// WITH ERROR MESSAGE SAYING YOU CAN'T UPLOAD PHOTOS

router.get('/', function(req, res){
	var data = { req: req }
	res.render('upload/index.ejs', data);
});

router.post('/', function(req, res){
	// Processing if upload succeeded
	if(uploadFlag == true) {
		var message = "Image upload Succes!";
		var data = {req:req, message:message}
		res.render('upload/index.ejs', data);
	}
	// Processing if upload was not an image
	if(uploadFlag == false) {
		var message = "The file uploaded is not an image";
		var data = {req:req, message:message}
		res.render('upload/index.ejs', data);
	}
});

module.exports = router;