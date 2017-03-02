/**
 * ApiController
 *
 * @description :: Server-side logic for managing apis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
    info: function (req, res) {

        res.json({
            version: '0.3.0'
        });

    }

};