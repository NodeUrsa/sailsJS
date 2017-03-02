module.exports = function(req, res, next) {    
    var userId = req.session.passport.user;
    if(userId){
	   	User.findOne(userId).exec(function(err,user){	   
	   		if(user.role === 1 || user.role === '1'){
			  	next();
	   		}else{	   			
				res.redirect((req.param('ref') === undefined ? '/' : req.param('ref')) + '?error=' + 'Access to the requested resource is not allowed.');
				// res.view('403');				
	   		}
	   	});
    	
    }else{
    	res.view('login')    	
    }
};