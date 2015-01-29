var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res){
	var title = "404";
	var message = "404 : Not Found!";
	var data = {req: req, message: message, title: title};
	//res.render('layout/404.ejs', data);
	res.status(404).render('layout/404.ejs', data);
});



module.exports = router;