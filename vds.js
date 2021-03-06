module.exports = {
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
  	displayImg: function (data, imageId, modevar) {
		var mode = "gallery"; // Set the mode - Defaults to Gallery
		var sql, sql2; // Create vars
		if (imageId >= 0 ) { 
			mode = "single"; // Set the mode to single if imageId is given
		}
		if (modevar) {
			mode = modevar; // Set mode to modevar
		}
		// Setup the required SQL based on the MODE
		if (mode == "gallery") {
			sql = 'SELECT photos.*, users.name AS username FROM photos LEFT JOIN users ON photos.user_id = users.id';
			data.title = "Gallery";
		} else if (mode == "single" ) {
			sql = 'SELECT photos.*, users.name AS username, users.id, users.user_level FROM photos LEFT JOIN users ON photos.user_id = users.id WHERE photos.id = ' + imageId;
			sql2 = 'SELECT * FROM comments WHERE photo_id = ' + imageId;
		} else if (mode == "edit" ) {
			sql = 'SELECT photos.*, users.name AS username, users.id, users.user_level FROM photos LEFT JOIN users ON photos.user_id = users.id WHERE photos.id = ' + imageId;
			//sql2 = 'SELECT * FROM comments WHERE photo_id = ' + imageId;
		}
		// Get the connection and ..
		data.req.getConnection(function(err, connection){
			if (err) {
				data.req.session.error = err + "";
				data.res.redirect('/404');
				return
			} else {
				// .. execute the SQL queries
				connection.query(sql, function(err, imagearray) {
					if (err) {
						data.req.session.error = err + "";
						data.res.redirect('/404');
						return
					} else {
						if (imagearray.length == 0) {
							data.req.session.error = ("No image found for this id - Are you sure there are images uploaded?");
							data.res.redirect('/404');
							return
						} else {	
							// Add specifics based on mode
							data.images = imagearray;
							if (imageId > 0) {
								data.images[0].id = imageId;
							}
							// Only for single mode - Get the comments
							if (mode == "single") {
								data.title = data.images[0].caption;
								connection.query(sql2, function(err, commentsarray) {
									if (err) {
										data.req.session.error = err + "";
										data.res.redirect('/404');
										return
									} else {
										if (data.images[0].user_id == data.req.session.userId){
											data.images[0].owner = true;
										}
										data.comments = commentsarray;
										data.res.render('gallery/index.ejs', data); // Render - Waited on SQL
										return
									}
								})
							}
						}
						if (mode == "gallery") {
							data.res.render('gallery/index.ejs', data); // Render - Only full Gallery
							return
						}
						if (mode == "edit") {
							if (data.images[0].user_id == data.req.session.userId || data.req.session.user_level >= 9) {
								data.res.render('gallery/edit.ejs', data); // Render - Edit single image
								return
							} else {
								data.req.session.error = "Not yours to edit";
	    						data.res.redirect('/404');
	    						return
							}
						}
					}
				})
			}
		})
	}
};