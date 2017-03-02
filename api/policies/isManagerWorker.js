module.exports = function(req, res, next) {    
    var userId = req.session.passport.user;
    if(userId){
	   	User.findOne(userId).exec(function(err,user){
	   		if(user.role === '5'){
			  	next();
	   		}else{	   			
					res.view('403');				
	   		}
	   	});
    	
    }else{
    	res.redirect('admin/login')
    }	 
};