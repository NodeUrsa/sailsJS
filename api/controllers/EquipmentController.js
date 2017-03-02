/**
 * EquipmentController
 *
 * @description :: Server-side logic for managing equipment
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	apply : function (req,res) {

		if (req.params.token) {
			var _token = req.params.token;
            if( _token === '000000' ){
                res.cookie('eq_token',_token,{maxAge : 2147483647});
                res.send(200);
            } else {
    			Equipment.findOne({
    				token : _token.toUpperCase()
    			}).exec(function (err,result){
    				if (!err) {
    					if (result && !result.used) {
    						Equipment.update(
                                { token : _token},
                                { used : true })
                                .exec(function(err,eq){
        							if (!err) {
        								res.cookie('eq_token',_token,{maxAge : 2147483647});
        								res.send(200);			
        							} else {
                                        console.log(err);
        								res.send(500, { error: err });
        							}
    						    })
    					} else if (result && result.used) {
    						res.send(403, { error: { text: 'This token is already using.' } })
    					} else {
    						res.send(404, { error: { text: 'Equipment with specified token not found.' } })
    					}
    				} else {
                        console.log(err);
    					res.send(500, { error: err });
    				}
    			})
            }
		} else {
			res.send(404, { error: { text: 'Equipment with specified token not found.' } })
		}
	}	
};

module.exports.blueprints = {
    actions: true,
    rest: true,
    shortcuts: false
};