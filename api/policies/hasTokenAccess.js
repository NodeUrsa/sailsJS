module.exports = function (req, res, next) {

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma','no-cache');
    res.set('Expires','0');
	
    var et  = req.cookies.eq_token;	
	
	if (et) {
        if (et === '000000') {
            next();
        } else {
    		Equipment.findOne({
    			token : et.toUpperCase()
    		}).exec(function(err,result){ 
    			if (result) {
    				if (result.status === 1) {
    					next();
    				}
    				if (result.status === 0 && req.is('json')) {
    					res.send(403, { error: { code: 2, text: 'You have no permission to access the application using this device. Please contact administrator.' } })
    				}
    				if (result.status === 0 && !req.is('json')) {
    					res.view('access', { token_inactive : true });
    				}
    			} else {
    				if (req.is('json')) {
    					res.send(403, { error: { code: 1, text: 'In order to access the application, you should specify your equipment token.' } })
    				}
    				if (!req.is('json')) {
                        res.view('access', { token_inactive : false });
    				}
    			}
    		});
            
        }
	} else { 
		if (req.is('json')) {
			res.send(403, { error: { code: 1, text: 'In order to access the application, you should specify your equipment token.' } })
		}
		if (!req.is('json')) { 
			res.view('access', { token_inactive : false });
		}
	} 
};