/**
 * LoginController
 *
 * @description :: Server-side logic for managing Logins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	login : function (req,res) {
		res.view('login');
	}
};

