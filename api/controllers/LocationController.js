/**
 * LocationController
 *
 * @description :: Server-side logic for managing Locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    destroy: function(req, res) {
        User.findOne({
            locationid: req.params.id
        }).exec(function(err, user) {
            if (!err) {
                if (user) {
                    res.send(406, {
                        error: {
                            text: 'Can\'t delete. Location has history.'
                        }
                    });
                } else {
                    Location.destroy(req.params.id)
                        .exec(function(err, location) {
                            if (!err) {
                                if (location[0]) {
                                    res.json(location[0])
                                } else {
                                    res.send('No record found with the specified `id`.')
                                }
                            } else {
                                res.send(500, err);
                            }
                        })
                }
            } else {
                res.send(500, err);
            }
        });
    }
    
};
