/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var und = require('underscore');

function nextWrapper (next) {
    return function (err, data) {
        if (err) {
            next(err);
        } else if (!data) {
            next('Not found.');
        } else {
            next(null, data);
        }
    };
}

module.exports = {
    
	create: function (req, res) { 
        var userName = req.param('userName');
        User.findOne({ userName : userName })
            .exec( function (err, user) {
                if (!err) {
                    if (user) {
                        res.json(404, { error : { text : 'The same UserName already exists' } } )
                    } else {
                        User.create(req.allParams()).exec( function (err, curUser ) {
                            res.json( curUser );
                        })
                    }
                } else {
                    res.json( 500, err );                
                }
            });
    },

    read: function (req, res) {
        
        var userId      = req.session.passport.user;
        var locationId  = req.param('locationId');

        async.auto({
            user: function (next, data) {
                User
                    .findOne(userId, nextWrapper(next));
            },
            users: ['user', function (next, data) {
                var dataUserRole = data.user.role;
                User
                    .find()
                    .populate('workDays')
                    .where({ role: (dataUserRole === 2 || dataUserRole === 5) ? [2,3,4,5] : [1,2,3,4,5] })
                    .where({ locationId : locationId })
                    .exec(nextWrapper(next));
            }]
        }, function (err, data) {
            if (req.is('json') && userId && locationId) {
                res.json(data.users);
            } else if (req.is('json') && !userId && !locationId){
                res.send(404);
            } else {
                User
                    .find()
                    .populate('workDays')
                    .exec(function (err, users) {
                        res.json(users);
                    })
            }
        });
    },

    update: function (req, res) {
        
        var updatingId   = req.session.passport ? req.session.passport.user : false;
        var updatedId    = req.params.id ? req.params.id : false;
        
        if (updatingId && updatedId && req.is('json')) {
            async.auto({
                updatingUser: function (next, data) {
                    User
                        .findOne(updatingId, nextWrapper(next))
                },
                updatedUser: ['updatingUser', function (next, data) {
                    User
                        .findOne(updatedId, nextWrapper(next));
                }]
            }, function (err, data) {
                    var updatingUserRole = data.updatingUser.role; 
                    var updatedUserRole = data.updatedUser.role;                    
                    if ((updatingUserRole === 2 || updatingUserRole === 5) && updatedUserRole === 3) {
                        User
                            .update(updatedId, req.allParams())
                            .exec(function (err, user) {
                                res.json(user);
                            })
                    } else if ((updatingUserRole === 2 || updatingUserRole === 5) && (updatedUserRole === 2 || updatedUserRole === 5 )) {
                        if (req.allParams().password === undefined ) {
                            User
                                .update(updatedId, req.allParams())
                                .exec(function (err, user) {
                                    res.json(user);
                                })
                        }
                    } else if (updatingUserRole === 1) {
                        User
                            .update(updatedId, req.allParams())
                            .exec(function (err, user) {
                                res.json(user);
                            });
                    } else {
                        res.json(403, { error: { code: 5, text: 'You have no permission to access this resource. Please contact administrator.' } })
                    }

            })
        } else if (updatedId && !req.is('json')) {
            User
                .update(updatedId, req.allParams())
                .exec(function (err, user) {
                    res.json(user);
                });
        } else {
            res.send(404);
        }
    }
};

