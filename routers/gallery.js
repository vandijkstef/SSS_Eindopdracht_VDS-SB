var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	req.getConnection(function(err, connection){
			var sql = 'SELECT * FROM photos';
			console.log(sql);
		    connection.query(sql, function(err, gallery){
		      	if(err) {
		      		console.log("SQL Error");
		      		return;
		      	} else {
		      		console.log(gallery);
		      		var message = "SQL Worked";
		      		var images = gallery;
					var data = { req: req, message: message, images: images }
					res.render('gallery/index.ejs', data);
		      	}
	      	})
		})
});

module.exports = router;