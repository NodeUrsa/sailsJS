module.exports = function(req, res, next){

	// if (res.is('json')) {
	// 	next();
	// } else {

	// }
	// var userId = req.session.passport.user;
	// User.findOne(userId).exec(function(err,user){
	// 	if(req.is('json')){
	// 		console.log('json');
	// 	}
	// 	if(!err){
	// 		if(user){
	// 			Location.findOne(user.locationId).exec(function(err,location){
	// 				if(location){
	// 					if(!location.activateLocation){
	// 						if(req.is('json')){
	// 							res.send(403, { error: { code: 1, text: 'Location is not activated.' } })
	// 						}else{
	// 							res.redirect('/');
	// 						}
	// 					}else{
	// 						next();
	// 					}
	// 				}else{
	// 					next();						
	// 				}

	// 			});
	// 		}else{
	// 			next();
	// 		}
	// 	}else{
	// 		next();
	// 	}
	// });
	var accepts = require('accepts')
	var accept = accepts(req)
	console.log(accept.types());
	console.log('PATH :'+req.path);
	console.log('ACCEPTED :');
	console.log(req.accepted);
	console.log('SUBDOMAINS :' +req.subdomains);
	console.log('URL :'+req.method);
	console.log('==================');
	next();
};