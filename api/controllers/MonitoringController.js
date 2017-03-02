/**
 * MonitoringController
 *
 * @description :: Server-side logic for managing Monitorings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment'),
    und    = require('underscore');

function nextWrapper (next, name) {
    var entryName = name || 'Entry';
    return function (err, data) {
        if (err) {
            next(err);
        } else if (!data) {
            next(entryName + ' not found.');
        } else {
            next(null, data);
        }
    };
}

module.exports = {
	
    workers: function (req,res)	{

        var locationId = req.param('locationId');

        if (!locationId) {
            res.send(400);
        } else {
            User.find()
                .populate('workDays')
                .where({ locationId: locationId })
                .where({ role: [3, 5] })
                .where({ active: true })
                .sort('lastName')
                .exec(function (err, users) {
                    if (err) {
                        res.send(400);
                    } else {
                        var _criteria = [];
                        for(var i = 0; i < users.length; i++) {
                            _criteria.push( users[i].id );
                        }
                        BatchHeader.find()
                            .where({ userId : _criteria })
                            .exec( function(err, batches) {
                                if (err) {
                                    res.send(400);
                                } else {
                                    var _users = und.first(und.filter(users, function (user) {
                                        return !!user.workDays[moment.localeData().weekdays(moment()).toLowerCase()];
                                    }), 12);
                                    for(var j = 0; j < _users.length; j++){
                                        _users[j].batch = und.findWhere(batches, { userId : _users[j].id })                                 
                                    }
                                    res.json(_users);
                                }
                            });
                    }
                });
        }

    },

    exceptionOrders: function (req, res) {

        async.auto({
            user: function (next, data) {
                User.findOne(req.session.passport.user, nextWrapper(next, 'User'));
            },
            location: ['user', function (next, data) {
                Location.findOne(data.user.locationId, nextWrapper(next, 'Location'));
            }],
            batchDetails: ['location', function (next, data) {              
                BatchDetail.find({ locationId: data.location.id }, nextWrapper(next, 'BatchDetails'));
            }],
            headers: ['batchDetails', function (next, data) {
                var query = Header.find().where({ branchId: data.location.branchId });
                und.each(data.batchDetails, function (batchDetail) {
                    query.where({
                        orderNumber: {
                            not: batchDetail.docNumber
                        },
                        deliveryNum: {
                            not: batchDetail.deliveryNumb
                        }
                    });
                });
                query.exec(nextWrapper(next, 'Headers'));
            }]
        }, function (err, data) {
          
            res.json(data.headers);            
        
        });
    },

    exceptionWorkers: function (req, res) {

        var orderNumber = req.param('orderNumber'),
            deliveryNum = req.param('deliveryNumber');

        var typeMap = {
            1: {
                pick: 'willcallPick',
                pack: 'willcallPack'
            },
            2: {
                pick: 'expressPick',
                pack: 'expressPack'
            },
            3: {
                pick: 'truckPick',
                pack: 'truckPack'
            }
        };

        async.auto({
            user: function (next, data) {
                User.findOne(req.session.passport.user, nextWrapper(next, 'User'));
            },
            workers: ['user', function (next, data) {
                User
                    .find()
                    .populate('workDays')
                    .where({
                        locationId: data.user.locationId,
                        role      : [3, 5],
                        active    : true
                    })
                    .exec(nextWrapper(next, 'Users'));
            }],
            location: ['user', function (next, data) {
                Location.findOne(data.user.locationId, nextWrapper(next, 'Location'));
            }],
            header: ['location', function (next, data) {
                Header.findOne({
                    branchId   : data.location.branchId,
                    orderNumber: orderNumber,
                    deliveryNum: deliveryNum
                }, nextWrapper(next, 'Header'));
            }],
            filteredWorkers: ['header', 'workers', function (next, data) {
                var users = [];
                users = und.filter(data.workers, function (user) {
                    return user[typeMap[data.header.orderType].pick];
                });
                users = und.filter(users, function (user) {
                    return !!user.workDays[moment.localeData().weekdays(moment()).toLowerCase()];
                });
                next(null, users);
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                res.json(data.filteredWorkers);
            }
        });

    },

    exceptionCreate: function (req, res) {

            var userId = req.param('userId');
            var orderNumber = req.param('orderNumber');
            var deliveryNumber = req.param('deliveryNumber');

            if(userId !== undefined ) {

                async.auto({
                    user: function (next, data) {
                        User.findOne(userId, nextWrapper(next));
                    },
                    location: ['user', function (next, data) {
                        Location.findOne(data.user.locationId, nextWrapper(next));
                    }],
                    headers: ['location', function (next, data) {
                        Header.find()
                            .where({ deliveryNum : deliveryNumber })
                            .where({ orderNumber : orderNumber })
                            .exec(nextWrapper(next));
                    }],
                    orderType: ['headers', function (next, data) {
                        OrderType.findOne({ orderType: data.headers[0].orderType, locationId : data.location.id }, nextWrapper(next))
                    }]
                }, function (err, data){
                    data.batchProcessType = 1;
                    BatchUtils.createBatch(data, function (err) {
                        if (err) {
                            console.log(err);
                            res.send(500, { error: err });
                        } else {
                            res.ok();
                        }
                    });
                });

            } else {

                var token  = req.cookies.eq_token; 
                async.auto({
                    token: function (next, data) {
                        Equipment.findOne( { token : token }, nextWrapper(next));
                    },
                    location: ['equipment', function (next, data) {
                        Location.findOne(data.token.locationId, nextWrapper);
                    }],
                    headers: ['location', function (next, data) {
                        Header.find()
                            .where({ deliveryNum : deliveryNumber })
                            .where({ orderNumber : orderNumber })
                            .exec(nextWrapper(next));
                    }],
                    orderType: ['headers', function (next, data) {
                        OrderType.findOne({ orderType: data.headers[0].orderType, locationId : data.location.id }, nextWrapper(next));
                    }]
                }, function (err, data) {
                    data.batchProcessType = 1;
                    BatchUtils.createBatch(data, function (err) {
                        if (err) {
                            console.log(err);
                            res.send(500, { error: err });
                        } else {
                            res.ok();
                        }
                    });
                });
            }
        
    }
};  

