var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res){
	var message = "404 : Not Found!";
	var data = {req: req, message: message};
	res.render('layout/404.ejs', data);
});



module.exports = router;