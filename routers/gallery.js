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
		      		var images = gallery;
					var data = { req: req, message: message, images: images }
					res.render('gallery/index.ejs', data);
		      	}
	      	})
		})
});

module.exports = router;