module.exports = function(req, res, next){

	var userId = req.session.passport.user;	
	if(userId){
		User.findOne(userId).exec(function(err,user){
			if(!err){
				if(user){
					Location.findOne(user.locationId).exec(function(err,location){
						if(location){
							if(!location.activateLocation){
								res.redirect((req.param('ref') === undefined ? '/' : req.param('ref')) + '?error=' + 'Location is not activated.');
							}else{
								next();
							}
						}else{
							res.redirect((req.param('ref') === undefined ? '/' : req.param('ref')) + '?error=' + 'Location is not defined.');
						}
					});
				}else{
					res.redirect((req.param('ref') === undefined ? '/' : req.param('ref')) + '?error=' + 'Error');
				}
			}else{
				res.redirect((req.param('ref') === undefined ? '/' : req.param('ref')) + '?error=' + 'Error');
			}
		});
	}else{
		res.redirect((req.param('ref') === undefined ? '/' : req.param('ref')) + '?error=' + 'Error');
	}

};